import axios from 'axios';
import { initDAL } from '../DAL';
import '../lib/syntaxHighlighter';

const httpClientAxios = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });
initDAL({ httpClient: httpClientAxios });
