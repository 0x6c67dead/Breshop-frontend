class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic originalError;

  ApiException({
    required this.message,
    this.statusCode,
    this.originalError,
  });

  @override
  String toString() => message;
}

class UnauthorizedException extends ApiException {
  UnauthorizedException() : super(message: 'Unauthorized', statusCode: 401);
}

class NetworkException extends ApiException {
  NetworkException() : super(message: 'Network error');
}

class TimeoutException extends ApiException {
  TimeoutException() : super(message: 'Request timeout');
}
