import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});

class ApiClient {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  static const String _tokenKey = 'auth_token';
  static const String baseUrl = 'http://localhost:3000/api'; // Change for production

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Add interceptors
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: _tokenKey);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Handle unauthorized - clear token
          _storage.delete(key: _tokenKey);
        }
        return handler.next(error);
      },
    ));
  }

  Future<void> setToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<String?> getToken() async {
    return _storage.read(key: _tokenKey);
  }

  // Auth
  Future<Response> register(Map<String, dynamic> data) {
    return _dio.post('/auth/register', data: data);
  }

  Future<Response> login(Map<String, dynamic> data) {
    return _dio.post('/auth/login', data: data);
  }

  Future<Response> getMe() {
    return _dio.get('/auth/me');
  }

  // Products
  Future<Response> getProducts({int page = 1, int limit = 20, String? category, String? verdict}) {
    return _dio.get('/products', queryParameters: {
      'page': page,
      'limit': limit,
      if (category != null) 'category': category,
      if (verdict != null) 'verdict': verdict,
    });
  }

  Future<Response> getProductByBarcode(String barcode) {
    return _dio.get('/products/barcode/$barcode');
  }

  Future<Response> getProductById(String id) {
    return _dio.get('/products/$id');
  }

  Future<Response> getProductAlternatives(String id, {String? city}) {
    return _dio.get('/products/$id/alternatives', queryParameters: {
      if (city != null) 'city': city,
    });
  }

  Future<Response> recordScan(String productId, {String? sessionId}) {
    return _dio.post('/products/$productId/scan', data: {
      if (sessionId != null) 'sessionId': sessionId,
    });
  }

  // Companies
  Future<Response> getCompanies({int page = 1, int limit = 20, String? verdict, String? search}) {
    return _dio.get('/companies', queryParameters: {
      'page': page,
      'limit': limit,
      if (verdict != null) 'verdict': verdict,
      if (search != null) 'search': search,
    });
  }

  Future<Response> getCompanyById(String id) {
    return _dio.get('/companies/$id');
  }

  Future<Response> getCompanyOwnership(String id) {
    return _dio.get('/companies/$id/ownership');
  }

  // Search
  Future<Response> searchAll(String query, {int limit = 20}) {
    return _dio.get('/search', queryParameters: {
      'q': query,
      'limit': limit,
    });
  }

  Future<Response> getCategories() {
    return _dio.get('/search/categories');
  }

  // Alternatives
  Future<Response> getTopAlternatives({String? city, int limit = 10}) {
    return _dio.get('/alternatives/top', queryParameters: {
      if (city != null) 'city': city,
      'limit': limit,
    });
  }

  Future<Response> getAlternativesByCategory(String categoryId, {String? city}) {
    return _dio.get('/alternatives/category/$categoryId', queryParameters: {
      if (city != null) 'city': city,
    });
  }

  // Stores
  Future<Response> getStoresForProduct(String alternativeId, {String? city}) {
    return _dio.get('/stores/product/$alternativeId', queryParameters: {
      if (city != null) 'city': city,
    });
  }

  Future<Response> confirmAvailability(Map<String, dynamic> data) {
    return _dio.post('/stores/confirm', data: data);
  }

  // Submissions
  Future<Response> getSubmissions({int page = 1, int limit = 20, String? status}) {
    return _dio.get('/submissions', queryParameters: {
      'page': page,
      'limit': limit,
      if (status != null) 'status': status,
    });
  }

  Future<Response> getMySubmissions({int page = 1, int limit = 20}) {
    return _dio.get('/submissions/user/mine', queryParameters: {
      'page': page,
      'limit': limit,
    });
  }

  Future<Response> createSubmission(Map<String, dynamic> data) {
    return _dio.post('/submissions', data: data);
  }

  Future<Response> voteOnSubmission(String id, Map<String, dynamic> data) {
    return _dio.post('/submissions/$id/vote', data: data);
  }

  // Users
  Future<Response> getLeaderboard({int limit = 20}) {
    return _dio.get('/users/leaderboard', queryParameters: {
      'limit': limit,
    });
  }

  Future<Response> getUserStats(String id) {
    return _dio.get('/users/$id/stats');
  }

  Future<Response> getUserBadges(String id) {
    return _dio.get('/users/$id/badges');
  }
}

