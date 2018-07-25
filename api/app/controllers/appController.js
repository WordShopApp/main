"use strict";

const http = require('../services/utils');

module.exports.status = (req, res) => {
  res.status(http.codes.ok).json({ status: "ok" });
};
