const CLASS_CALL_RULE = {
  scope: 'class',
  begin: /(?<=new\s+)[A-Z][a-zA-Z0-9_]*/,
};

export { CLASS_CALL_RULE };
