class ErrorWithStatus extends Error {
  constructor(originalError, statusCode, message) {
    if (process.env.NODE_ENV === "development" && originalError) {
      super(originalError.message);
    } else if (process.env.NODE_ENV === "development" && !originalError) {
      super(message);
    } else {
      super(message);
      this.stack = null;
    }

    this.status = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  toPlainSocketErrorObject() {
    return { data: this.status, status: this.status, message: this.message };
  }
}

module.exports = ErrorWithStatus;
