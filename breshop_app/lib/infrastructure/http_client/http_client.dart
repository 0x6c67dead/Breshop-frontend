import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import '../../core/constants.dart';
import 'exceptions.dart';

class HttpClient extends http.BaseClient {
  final http.Client _inner = http.Client();
  final String baseUrl;
  final String? Function()? getToken;

  HttpClient({
    required this.baseUrl,
    this.getToken,
  });

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    // Add default headers
    request.headers['Content-Type'] = 'application/json';
    request.headers['Accept'] = 'application/json';

    // Add token if available
    final token = getToken?.call();
    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    try {
      // Send with timeout
      final streamedResponse = await _inner.send(request).timeout(
        const Duration(seconds: Constants.httpTimeoutSeconds),
      );

      // Convert to regular Response
      final response = await http.Response.fromStream(streamedResponse);

      // Handle status codes
      if (response.statusCode == 401) {
        throw UnauthorizedException();
      }

      if (response.statusCode >= 400) {
        throw ApiException(
          message: 'Server error',
          statusCode: response.statusCode,
        );
      }

      return http.StreamedResponse(
        Stream.value(response.bodyBytes),
        response.statusCode,
        request: request,
        headers: response.headers,
        isRedirect: response.isRedirect,
        persistentConnection: response.persistentConnection,
        reasonPhrase: response.reasonPhrase,
      );
    } on http.ClientException {
      throw NetworkException();
    } on TimeoutException {
      throw TimeoutException();
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException(message: e.toString());
    }
  }

  // Custom helpers for JSON
  Future<Map<String, dynamic>> getRequest(String path) async {
    final response = await super.get(Uri.parse('$baseUrl$path'));
    return _parseObjectResponse(response);
  }

  Future<List<dynamic>> getListRequest(String path) async {
    final response = await super.get(Uri.parse('$baseUrl$path'));
    return _parseListResponse(response);
  }

  Future<Map<String, dynamic>> postRequest(
    String path, {
    required Map<String, dynamic> body,
  }) async {
    final response = await super.post(
      Uri.parse('$baseUrl$path'),
      body: jsonEncode(body),
    );
    return _parseObjectResponse(response);
  }

  Future<Map<String, dynamic>> deleteRequest(String path) async {
    final response = await super.delete(Uri.parse('$baseUrl$path'));
    return _parseObjectResponse(response);
  }

  List<dynamic> _parseListResponse(http.Response response) {
    try {
      if (response.body.isEmpty) return [];
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      return [];
    } catch (e) {
      throw ApiException(
        message: 'Failed to parse list response',
        statusCode: response.statusCode,
      );
    }
  }

  Map<String, dynamic> _parseObjectResponse(http.Response response) {
    try {
      if (response.body.isEmpty) return {};
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) return decoded;
      return {};
    } catch (e) {
      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'status': 'success'};
      }
      throw ApiException(
        message: 'Failed to parse response',
        statusCode: response.statusCode,
      );
    }
  }

  @override
  void close() {
    _inner.close();
    super.close();
  }
}
