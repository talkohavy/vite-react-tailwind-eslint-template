// src/common/constants/apiUrls.ts
var API_PLACEHOLDER = "___API_PLACEHOLDER___";
var API_GATEWAY_URL = API_PLACEHOLDER.includes("API_PLACEHOLDER") ? "http://localhost:8000" : API_PLACEHOLDER;

// src/common/constants/indexedDB.ts
var dbName = "vite-react-template";
var dynamicTableName = "dynamic";
var usersTableName = "users";
var syncRequestsTableName = "sync-requests";
var tables = [
  { tableName: dynamicTableName },
  {
    tableName: usersTableName,
    indexes: []
  },
  {
    tableName: syncRequestsTableName,
    autoIncrement: true,
    indexes: []
  }
];

// src/common/utils/uuid.ts
function uuid() {
  if (typeof crypto.randomUUID === "undefined") {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
  }
  return crypto.randomUUID();
}

// src/lib/SessionManager/SessionManager.ts
var sessionManager = null;

// src/lib/HttpClient/logic/constants.ts
var HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE"
};
var HttpHeaders = {
  REQUEST_ID: "x-request-id",
  BROWSER_ID: "x-browser-id",
  TAB_ID: "x-tab-id"
};

// src/lib/HttpClient/logic/HttpError.ts
var HttpError = class extends Error {
  status;
  url;
  method;
  requestBody;
  requestHeaders;
  responseHeaders;
  requestId;
  type;
  constructor(props) {
    const { message, status, url, method, requestBody, requestHeaders, responseHeaders, requestId, type } = props;
    super(message);
    this.status = status;
    this.url = url;
    this.method = method;
    this.requestBody = requestBody;
    this.requestHeaders = requestHeaders;
    this.responseHeaders = responseHeaders;
    this.requestId = requestId;
    this.type = type;
    Object.defineProperty(this, "name", { value: "HttpError", enumerable: true });
    Object.defineProperty(this, "message", { value: message, enumerable: true });
    Object.defineProperty(this, "stack", { enumerable: true });
  }
};

// src/lib/HttpClient/HttpClient.ts
var httpClient;
var HttpClient = class {
  constructor(_baseUrl) {
    this._baseUrl = _baseUrl;
    this.abortControllers = /* @__PURE__ */ new Map();
  }
  abortControllers;
  set baseUrl(url) {
    this.baseUrl = url;
  }
  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  get(url, options) {
    return this.execute({ url, method: HttpMethod.GET, ...options });
  }
  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  post(url, options) {
    return this.execute({ url, method: HttpMethod.POST, ...options });
  }
  put(url, options) {
    return this.execute({ url, method: HttpMethod.PUT, ...options });
  }
  patch(url, options) {
    return this.execute({ url, method: HttpMethod.PATCH, ...options });
  }
  delete(url, options) {
    return this.execute({ url, method: HttpMethod.DELETE, ...options });
  }
  execute(props) {
    const { url, method, body, headers: additionalHeaders } = props;
    const requestId = uuid();
    const fullTargetUrl = `${this._baseUrl}${url}`;
    const headers = new Headers(additionalHeaders);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set(HttpHeaders.REQUEST_ID, requestId);
    if (sessionManager) {
      const { localStorageId, sessionStorageId } = sessionManager.getSessionIds();
      headers.set(HttpHeaders.BROWSER_ID, localStorageId);
      headers.set(HttpHeaders.TAB_ID, sessionStorageId);
    }
    const promise = this.executeRequest({
      fullTargetUrl,
      headers,
      method,
      body,
      requestId
    });
    const requestInfo = {
      url: fullTargetUrl,
      method,
      body,
      headers,
      requestId
    };
    const abort = () => {
      this.abortRequestById(requestId);
    };
    return { promise, requestInfo, abort };
  }
  async executeRequest(params) {
    const { fullTargetUrl, headers, method, body, requestId } = params;
    const signal = this.addAbortControllerToList(requestId);
    try {
      const response = await fetch(fullTargetUrl, {
        body: JSON.stringify(body),
        headers,
        method,
        credentials: "include",
        signal
      });
      this.removeAbortControllerFromList(requestId);
      const { error, data } = await this.handleServerResponse(response);
      if (error) {
        const { status, url, headers: responseHeaders, type } = response;
        throw new HttpError({
          message: error.message,
          status,
          url,
          method,
          requestBody: body,
          requestHeaders: headers,
          responseHeaders,
          requestId,
          type
        });
      }
      return data;
    } catch (error) {
      this.removeAbortControllerFromList(requestId);
      throw error;
    }
  }
  abortRequestById(requestId) {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }
  abortAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }
  async handleServerResponse(responseRaw) {
    try {
      const parsedBody = await this.parseResponseBody(responseRaw);
      if (!responseRaw.ok) return this.handleNotOk(responseRaw.status, parsedBody);
      return { data: parsedBody };
    } catch (error) {
      return {
        error: {
          message: "Failed to process response",
          status: responseRaw.status,
          originalError: error
        }
      };
    }
  }
  async parseResponseBody(responseRaw) {
    const responseText = await responseRaw.text();
    let parsedBody;
    try {
      parsedBody = responseText ? JSON.parse(responseText) : null;
    } catch {
      parsedBody = { message: responseText || "No response body" };
    }
    return parsedBody;
  }
  handleNotOk(statusCode, parsedBody) {
    const errorMessage = parsedBody?.message || parsedBody?.error || (typeof parsedBody === "string" ? parsedBody : "Request failed");
    return { error: { message: errorMessage, status: statusCode } };
  }
  addAbortControllerToList(requestId) {
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);
    return abortController.signal;
  }
  removeAbortControllerFromList(requestId) {
    this.abortControllers.delete(requestId);
  }
};
function initHttpClient(apiGatewayUrl) {
  httpClient = new HttpClient(apiGatewayUrl);
}

// src/lib/IndexedDB/logic/IndexDBFactory.ts
var IndexDBFactory = class {
  db;
  upgradeAttempts;
  maxUpgradeAttempts;
  upgradeRetryTimeout;
  constructor() {
    this.db = null;
    this.upgradeAttempts = 0;
    this.maxUpgradeAttempts = 5;
    this.upgradeRetryTimeout = 3e3;
  }
  async initializeDB(props) {
    const { dbName: dbName2, tables: tables2, version } = props;
    return new Promise((resolve, reject) => {
      try {
        if (this.db) {
          this.db.close();
          this.db = null;
        }
        const request = indexedDB.open(dbName2, version);
        request.onblocked = (_event) => this.handleAnotherTabHasDBOpenWithOlderVersion(props, resolve, reject);
        request.onupgradeneeded = (event) => {
          console.log(`Upgrading database from version ${event.oldVersion} to ${event.newVersion}`);
          if (event.oldVersion === 0) {
            console.log("A new database was created.");
          } else {
            console.log("An existing database was upgraded.");
          }
          const db = event.target.result;
          this.db = db;
          const activeTransaction = event.target.transaction;
          this.deleteTablesNotInSchema(tables2);
          this.createOrUpdateTables(activeTransaction, tables2);
        };
        request.onsuccess = (event) => {
          this.db = event.target.result;
          this.upgradeAttempts = 0;
          this.db.onversionchange = () => {
            this.db?.close();
            this.db = null;
            console.log("A new version of the application is ready. Please reload the page.");
            alert("A new version of the application is ready. Please reload the page.");
            window.location.reload();
          };
          console.log(`Database ${dbName2} initialized successfully with version ${version}!`);
          resolve(this.db);
        };
        request.onerror = (event) => {
          const error = event.target.error;
          reject({ message: `Failed to initialize database: ${error?.message}` });
        };
      } catch (error) {
        reject({ message: `Unexpected error initializing database: ${error.message}` });
      }
    });
  }
  deleteTablesNotInSchema(tables2) {
    if (!this.db) throw new Error("Database not initialized");
    const tableNames = tables2.map((table) => table.tableName);
    const existingTableNames = Array.from(this.db.objectStoreNames);
    existingTableNames.forEach((existingTableName) => {
      if (!tableNames.includes(existingTableName)) {
        try {
          console.log(`Deleting table ${existingTableName} as it's no longer needed`);
          this.db?.deleteObjectStore(existingTableName);
        } catch (error) {
          console.error(`Error deleting table ${existingTableName}:`, error);
        }
      }
    });
  }
  createOrUpdateTables(activeTransaction, tables2) {
    if (!this.db) throw new Error("Database not initialized");
    tables2.forEach((table) => {
      const { tableName, recordId = "id", autoIncrement, indexes = [] } = table;
      try {
        const isTableAlreadyExists = this.isTableAlreadyExists(tableName);
        const tableClient = isTableAlreadyExists ? this.getTableClientFromActiveTransaction(activeTransaction, tableName) : this.createNewTableClient({ tableName, recordId, autoIncrement });
        const filteredIndexes = indexes.filter(({ indexName }) => !tableClient.indexNames.contains(indexName));
        filteredIndexes.forEach(({ indexName, fieldName, unique = false }) => {
          tableClient.createIndex(indexName, fieldName, { unique });
        });
      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error);
      }
    });
  }
  /**
   * Retry database initialization after a timeout.
   */
  retryInitialization(props, resolve, reject) {
    this.upgradeAttempts++;
    if (this.upgradeAttempts <= this.maxUpgradeAttempts) {
      console.log(`Retrying database initialization (Attempt ${this.upgradeAttempts}/${this.maxUpgradeAttempts})...`);
      setTimeout(async () => {
        try {
          const db = await this.initializeDB(props);
          resolve(db);
        } catch (error) {
          reject(error);
        }
      }, this.upgradeRetryTimeout);
      return;
    }
    reject({ message: "Maximum upgrade attempts reached. Please close other browser tabs and reload the page." });
  }
  isTableAlreadyExists(tableName) {
    if (!this.db) throw new Error("Database not initialized");
    return this.db.objectStoreNames.contains(tableName);
  }
  getTableClientFromActiveTransaction(activeTransaction, tableName) {
    if (!this.db) throw new Error("Database not initialized");
    try {
      const tableClient = activeTransaction.objectStore(tableName);
      return tableClient;
    } catch (error) {
      console.error(`Error getting table client for ${tableName}:`, error);
      throw new Error(`Could not access table ${tableName}: ${error.message}`);
    }
  }
  createNewTableClient(props) {
    if (!this.db) throw new Error("Database not initialized");
    const { tableName, recordId, autoIncrement } = props;
    try {
      const tableClient = this.db.createObjectStore(tableName, { keyPath: recordId, autoIncrement });
      return tableClient;
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
      throw new Error(`Failed to create table ${tableName}: ${error.message}`);
    }
  }
  handleAnotherTabHasDBOpenWithOlderVersion(props, resolve, reject) {
    console.warn("Database upgrade blocked. Another tab may be using the database.");
    const userClickedOk = confirm(
      "Application update is waiting. Please close other tabs using this application, then click OK to continue."
    );
    if (userClickedOk) return this.retryInitialization(props, resolve, reject);
    reject(new Error("Database upgrade blocked by user choice."));
  }
};

// src/lib/IndexedDB/indexedDB.ts
var IndexedDBClient = class {
  db;
  constructor(db) {
    this.db = db;
  }
  /**
   * @description
   * Returns the id of the record, which can later be used to get record by ID.
   *
   * If `autoIncrement` is `false`, it can throw an error if a record
   * with the same exact id already exists.
   */
  async addRecord(props) {
    const { tableName, data } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readwrite");
      const tableClient = transaction.objectStore(tableName);
      const addRequest = tableClient.add(data);
      addRequest.onsuccess = () => {
        const result = addRequest.result;
        resolve(result);
      };
      addRequest.onerror = (event) => {
        const errorMessage = event.target.error;
        reject({ message: `Create failed: ${errorMessage}` });
      };
    });
  }
  /**
   * @description
   * Same as `addRecord`, only it does not throw an error if a record
   * with the same exact id already exists. In such case, it overrides it.
   */
  async upsertRecord(props) {
    const { tableName, data } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readwrite");
      const tableClient = transaction.objectStore(tableName);
      const putRequest = tableClient.put(data);
      putRequest.onsuccess = () => {
        const result = putRequest.result;
        resolve(result);
      };
      putRequest.onerror = (event) => {
        const errorMessage = event.target.error;
        reject({ message: `Create failed: ${errorMessage}` });
      };
    });
  }
  async getRecordById(props) {
    const { tableName, id } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readonly");
      const tableClient = transaction.objectStore(tableName);
      const getRequest = tableClient.get(id);
      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (result) return resolve(result);
        return resolve(null);
      };
      getRequest.onerror = (event) => {
        const errorMessage = event.target.error;
        reject({ message: `Read failed: ${errorMessage}` });
      };
    });
  }
  async getAll(props) {
    const { tableName } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readonly");
      const tableClient = transaction.objectStore(tableName);
      const getAllRequest = tableClient.getAll();
      getAllRequest.onsuccess = () => {
        const result = getAllRequest.result;
        resolve(result);
      };
      getAllRequest.onerror = (event) => {
        const { error } = event.target;
        reject({ message: `Read all failed: ${error}` });
      };
    });
  }
  /**
   * @description
   * **SLOW!**
   *
   * Try to avoid if you can, and use one of the other methods.
   *
   * Fetches all the records from the DB, and filters them using javascript.
   */
  async getRecordsByQuery(props) {
    const { tableName, query } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readonly");
      const tableClient = transaction.objectStore(tableName);
      const getAllRequest = tableClient.getAll();
      getAllRequest.onsuccess = () => {
        const result = getAllRequest.result;
        const filteredResults = result.filter(
          (item) => (
            // Ensure the query's key exists and matches the value
            Object.keys(query).every((key) => query[key] === item[key])
          )
        );
        resolve(filteredResults);
      };
      getAllRequest.onerror = (event) => {
        const errorMessage = event.target.error;
        reject({ message: `Find query failed: ${errorMessage}` });
      };
    });
  }
  /**
   * @description
   * This update behaves like a PUT request. It will update the record if it exists, or create a new one if it doesn't.
   */
  async updateRecordById(props) {
    const { tableName, id, updatedData } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readwrite");
      const tableClient = transaction.objectStore(tableName);
      const request = tableClient.put({ ...updatedData, id });
      request.onsuccess = () => resolve(`Item with id ${id} updated.`);
      request.onerror = (event) => {
        const { error } = event.target;
        reject({ message: `Update failed: ${error}` });
      };
    });
  }
  async deleteRecordById(props) {
    const { tableName, id } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readwrite");
      const tableClient = transaction.objectStore(tableName);
      const request = tableClient.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => {
        const { error } = event.target;
        console.warn(error);
        resolve(false);
      };
    });
  }
  async clearAll(props) {
    const { tableName } = props;
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const transaction = this.db.transaction([tableName], "readwrite");
      const tableClient = transaction.objectStore(tableName);
      const request = tableClient.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => {
        const { error } = event.target;
        console.warn(error);
        resolve(false);
      };
    });
  }
  /**
   * @description
   * Retrieves records from a table based on a specific indexed field.
   */
  async getRecordsByIndex(props) {
    const { tableName, indexName, value } = props;
    if (!this.db) throw new Error("Database not initialized");
    const transaction = this.db.transaction([tableName], "readonly");
    const objectStore = transaction.objectStore(tableName);
    const index = objectStore.index(indexName);
    const request = index.getAll(value);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(new Error(`Failed to retrieve records by index: ${request.error}`));
      };
    });
  }
  // List all databases (Browser support may vary)
  static async listDatabases() {
    if ("databases" in indexedDB) return indexedDB.databases();
    console.warn("The `indexedDB.databases()` API is not supported in this browser. Falling back to empty array.");
    return [];
  }
  /**
   * @description
   * List all object stores (tables) in the current database
   */
  async listTables() {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject({ message: "Database not initialized" });
      const tableNames = Array.from(this.db.objectStoreNames);
      resolve(tableNames);
    });
  }
};
var indexedDBClient = new IndexedDBClient(null);
async function initIndexedDB(props) {
  try {
    const { dbName: dbName2, tables: tables2, version = 1 } = props;
    if (tables2.length === 0) throw new Error("You must provide at least one table to create.");
    const indexDBFactory = new IndexDBFactory();
    const idbDatabase = await indexDBFactory.initializeDB({ dbName: dbName2, tables: tables2, version });
    indexedDBClient = new IndexedDBClient(idbDatabase);
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
  }
}

// src/common/constants/cacheNames.ts
var STATIC_CACHE_NAME = "static-cache";
var DYNAMIC_CACHE_NAME = "dynamic-cache";

// src/lib/ServiceWorker/logic/AssetManager.ts
var DEFAULT_HTML_FILE = "/vite-react-tailwind-eslint-template/index.html";
var AssetManager = class {
  cacheIgnoreList;
  cacheLimit;
  constructor(options = {}) {
    this.cacheIgnoreList = options.cacheIgnoreList ?? [];
    this.cacheLimit = options.cacheLimit ?? 50;
  }
  async cacheStaticAssets() {
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    const appShell = ["/vite-react-tailwind-eslint-template", DEFAULT_HTML_FILE, "/vite-react-tailwind-eslint-template/vite.svg"];
    await staticCache.addAll(appShell);
    await this.precacheBuildAssets(staticCache);
  }
  async precacheBuildAssets(cache) {
    try {
      const manifestResponse = await fetch("/vite-react-tailwind-eslint-template/vite-manifest.json");
      if (!manifestResponse.ok) return;
      const manifest = await manifestResponse.json();
      const assetUrls = Object.values(manifest).flatMap((entry) => {
        const urls = [];
        urls.push(`/${entry.file}`);
        if (entry.css) urls.push(...entry.css.map((css) => `/${css}`));
        return urls;
      });
      const uniqueUrls = [...new Set(assetUrls)];
      await cache.addAll(uniqueUrls);
    } catch {
      console.warn("Failed to fetch vite-manifest.json. Web app will not work in offline mode.");
    }
  }
  async cleanUpOldCaches() {
    const cacheNames = await caches.keys();
    const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
    const cachesToDelete = cacheNames.filter((cacheName) => !cacheWhitelist.includes(cacheName));
    const promiseArr = cachesToDelete.map(async (cacheName) => {
      try {
        return caches.delete(cacheName);
      } catch {
        console.log(`cacheName ${cacheName} does not exists. moving on...`);
      }
    });
    return Promise.all(promiseArr);
  }
  shouldBeCached(url) {
    return !this.cacheIgnoreList.some((ignoreUrl) => url.includes(ignoreUrl));
  }
  /**
   * @description
   * Fast, but not always reliable. If the network is slow, it may return a cached response instead of the latest one.
   * This is useful for assets that don't change often, like images or fonts.
   */
  async cacheWithNetworkFallbackStrategy(event) {
    const eventRequestUrl = event.request.url;
    const shouldBeCached = this.shouldBeCached(eventRequestUrl);
    try {
      if (!shouldBeCached) {
        const response2 = await fetch(event.request);
        return response2;
      }
      const cacheHit = await caches.match(eventRequestUrl);
      if (cacheHit) return cacheHit;
      const response = await fetch(event.request);
      if (response.status === 200 && response.type === "basic") {
        await this.dynamicallyCacheResponse(event, response);
      }
      return response;
    } catch (error) {
      console.error(error);
      if (!shouldBeCached) {
        return new Response("Offline", { status: 503, statusText: "Client Offline" });
      }
      if (event.request.mode === "navigate") {
        return caches.match(DEFAULT_HTML_FILE);
      }
      return new Response("Offline", { status: 503, statusText: "Client Offline" });
    }
  }
  /**
   * @description
   * Slower, but more reliable. It will always return the latest response from the network.
   * If the network is unavailable, it will return the cached response.
   * This is useful for assets that change often, like API responses.
   */
  async networkWithCacheFallbackStrategy(event) {
    try {
      const response = await fetch(event.request);
      if (response.status === 200 && response.type === "basic") {
        await this.dynamicallyCacheResponse(event, response);
      }
      return response;
    } catch (error) {
      console.error(error);
      const cacheHit = await caches.match(event.request.url);
      if (cacheHit) return cacheHit;
      if (event.request.mode === "navigate") {
        return caches.match(DEFAULT_HTML_FILE);
      }
      return new Response("Offline", { status: 503, statusText: "Client Offline" });
    }
  }
  async dynamicallyCacheResponse(event, response) {
    const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
    const responseClone = response.clone();
    const cacheKeys = await dynamicCache.keys();
    const cacheLength = cacheKeys.length;
    if (cacheLength >= this.cacheLimit) {
      const removeCount = cacheLength - this.cacheLimit + 1;
      await this.removeOverflowCache(dynamicCache, removeCount);
    }
    await dynamicCache.put(event.request.url, responseClone);
  }
  async removeOverflowCache(dynamicCache, removeCount) {
    const cacheKeys = await dynamicCache.keys();
    const promiseArr = [];
    for (let i = 0; i < removeCount; i++) {
      const oldestCacheKey = cacheKeys[i];
      promiseArr.push(dynamicCache.delete(oldestCacheKey));
    }
    return Promise.all(promiseArr);
  }
};

// src/common/constants/statusCodes.ts
var StatusCodes = {
  Conflict: 409
};

// src/lib/ServiceWorker/logic/utils/syncAllRequests.ts
async function syncAllRequests() {
  const requestsToSend = await indexedDBClient.getAll({
    tableName: syncRequestsTableName
  });
  for (const request of requestsToSend) {
    try {
      const { id, url, options } = request;
      await httpClient.post(url, options).promise;
      await indexedDBClient.deleteRecordById({ tableName: syncRequestsTableName, id });
    } catch (error) {
      if (error instanceof HttpError && error.status === StatusCodes.Conflict) {
        await indexedDBClient.deleteRecordById({ tableName: syncRequestsTableName, id: request.id });
        continue;
      }
      console.log(`Error processing request with id of "${request.id}"`, error);
    }
  }
}

// src/common/constants/serviceWorker.ts
var SYNC_REQUESTS_TAG = "sync-requests";

// src/lib/ServiceWorker/ServiceWorker.ts
var MyServiceWorker = class _MyServiceWorker {
  static instance;
  static _self;
  constructor() {
  }
  // <--- prevent instantiation
  static getInstance(self2) {
    if (!_MyServiceWorker.instance) {
      _MyServiceWorker.instance = new _MyServiceWorker();
      _MyServiceWorker._self = self2;
    }
    return _MyServiceWorker.instance;
  }
  /**
   * On install, the Service Worker caches the static assets.
   */
  static addOnInstalListener(onInstall) {
    _MyServiceWorker._self.addEventListener("install", (event) => {
      event.waitUntil(onInstall());
    });
  }
  /**
   * On activate, the Service Worker cleans up the old caches.
   */
  static addOnActivateListener(onActivate) {
    _MyServiceWorker._self.addEventListener("activate", (event) => {
      event.waitUntil(onActivate().then(() => _MyServiceWorker._self.clients.claim()));
    });
  }
  /**
   * On fetch, the Service Worker caches the dynamic assets.
   */
  static addOnFetchListener(onFetch) {
    _MyServiceWorker._self.addEventListener("fetch", (event) => {
      event.respondWith(onFetch(event));
    });
  }
  /**
   * On sync, the Service Worker syncs the data.
   */
  static addOnSyncListener(onSync) {
    _MyServiceWorker._self.addEventListener("sync", (event) => {
      if (event.tag !== SYNC_REQUESTS_TAG) {
        console.error("No tag found for sync event");
        return;
      }
      event.waitUntil(onSync(event));
    });
  }
};

// src/lib/ServiceWorker/initServiceWorker.ts
initServiceWorker();
function initServiceWorker() {
  const version = 1;
  const assetManagerOptions = {
    cacheIgnoreList: ["@fs", "@react-refresh", "@vite", "chrome-extension://"],
    cacheLimit: 2e3
  };
  const assetManager = new AssetManager(assetManagerOptions);
  initHttpClient(API_GATEWAY_URL);
  const indexedDBInitPromise = initIndexedDB({ dbName, tables, version });
  MyServiceWorker.getInstance(self);
  MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets.bind(assetManager));
  MyServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches.bind(assetManager));
  MyServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy.bind(assetManager));
  MyServiceWorker.addOnSyncListener((event) => {
    event.waitUntil(indexedDBInitPromise.then(syncAllRequests));
  });
}
