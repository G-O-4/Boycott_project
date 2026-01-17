import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  static final Map<String, Map<String, String>> _localizedValues = {
    'ar': {
      'appName': 'مقاطعة',
      'home': 'الرئيسية',
      'discover': 'اكتشف',
      'community': 'المجتمع',
      'profile': 'حسابي',
      'scan': 'امسح',
      'search': 'بحث',
      'searchHint': 'ابحث بالاسم أو الباركود...',
      'scanProduct': 'امسح المنتج',
      'pointCameraAtBarcode': 'وجّه الكاميرا نحو الباركود',
      'recentScans': 'المسح الأخير',
      'trending': 'الأكثر بحثاً',
      'alternatives': 'البدائل',
      'why': 'لماذا؟',
      'ownershipChain': 'سلسلة الملكية',
      'whereToBuy': 'أين أجد البدائل؟',
      'shareInfo': 'مشاركة هذه المعلومات',
      'avoid': 'تجنّب',
      'caution': 'حذر',
      'preferred': 'مُوصى به',
      'unknown': 'غير معروف',
      'confidence': 'الثقة',
      'status': 'الحالة',
      'lastReview': 'آخر مراجعة',
      'exactMatch': 'بديل مطابق',
      'claims': 'الادعاءات والأدلة',
      'sources': 'المصادر',
      'brands': 'العلامات التجارية',
      'products': 'المنتجات',
      'stores': 'المتاجر',
      'lastConfirmed': 'آخر تأكيد',
      'openMap': 'فتح الخريطة',
      'login': 'تسجيل الدخول',
      'register': 'إنشاء حساب',
      'logout': 'تسجيل الخروج',
      'email': 'البريد الإلكتروني',
      'password': 'كلمة المرور',
      'confirmPassword': 'تأكيد كلمة المرور',
      'name': 'الاسم',
      'city': 'المدينة',
      'language': 'اللغة',
      'settings': 'الإعدادات',
      'yourStats': 'إحصائياتك',
      'totalScans': 'إجمالي المسح',
      'thisWeek': 'هذا الأسبوع',
      'productsAvoided': 'منتجات تم تجنبها',
      'alternativesFound': 'بدائل تم إيجادها',
      'badges': 'الإنجازات',
      'submissions': 'الاقتراحات',
      'leaderboard': 'المتصدرون',
      'level': 'المستوى',
      'points': 'نقطة',
      'back': 'العودة',
      'viewAll': 'عرض الكل',
      'noResults': 'لم يتم العثور على نتائج',
      'productNotFound': 'المنتج غير موجود',
      'suggestProduct': 'اقترح هذا المنتج',
      'loading': 'جاري التحميل...',
      'error': 'حدث خطأ',
      'retry': 'إعادة المحاولة',
      'selectCity': 'اختر المدينة',
      'tripoli': 'طرابلس',
      'benghazi': 'بنغازي',
      'misrata': 'مصراتة',
      'noAccount': 'ليس لديك حساب؟',
      'haveAccount': 'لديك حساب بالفعل؟',
      'welcomeBack': 'مرحباً بعودتك',
      'createAccount': 'إنشاء حساب جديد',
      'welcome': 'مرحباً بك في مقاطعة',
      'appTagline': 'اعرف المنتج… وبدّله ببديل متاح',
      'browseByCategory': 'تصفح حسب الفئة',
      'mostAvailable': 'الأكثر توفراً في مدينتك',
      'didYouKnow': 'هل كنت تعلم؟',
      'popularSwaps': 'بدائل شائعة',
      'from': 'من',
      'to': 'إلى',
      'alternativeTo': 'بديل لـ',
      'confirmations': 'تأكيد توفر',
      'ownedBrands': 'العلامات التجارية التابعة',
      'alsoOwns': 'تمتلك أيضاً',
      'ownedBy': 'مملوكة لـ',
      'noClaims': 'لا توجد ادعاءات مسجلة',
      'noAlternatives': 'لا توجد بدائل مسجلة',
      'helpAddInfo': 'ساعدنا بإضافة معلومات',
      'signInToParticipate': 'سجل دخولك للمشاركة في المجتمع',
      'submit': 'اقتراح',
      'mySubmissions': 'اقتراحاتي',
      'pending': 'قيد المراجعة',
      'approved': 'مقبول',
      'rejected': 'مرفوض',
      'contribution': 'مساهمة',
      'scans': 'عملية مسح',
      'accountSettings': 'إعدادات الحساب',
      'noSubmissions': 'لا توجد اقتراحات بعد',
      'submitFirst': 'قدم اقتراحك الأول',
    },
    'en': {
      'appName': 'Boycott',
      'home': 'Home',
      'discover': 'Discover',
      'community': 'Community',
      'profile': 'Profile',
      'scan': 'Scan',
      'search': 'Search',
      'searchHint': 'Search by name or barcode...',
      'scanProduct': 'Scan Product',
      'pointCameraAtBarcode': 'Point camera at barcode',
      'recentScans': 'Recent Scans',
      'trending': 'Trending',
      'alternatives': 'Alternatives',
      'why': 'Why?',
      'ownershipChain': 'Ownership Chain',
      'whereToBuy': 'Where to find alternatives?',
      'shareInfo': 'Share this info',
      'avoid': 'Avoid',
      'caution': 'Caution',
      'preferred': 'Preferred',
      'unknown': 'Unknown',
      'confidence': 'Confidence',
      'status': 'Status',
      'lastReview': 'Last review',
      'exactMatch': 'Exact match',
      'claims': 'Claims & Evidence',
      'sources': 'Sources',
      'brands': 'Brands',
      'products': 'Products',
      'stores': 'Stores',
      'lastConfirmed': 'Last confirmed',
      'openMap': 'Open map',
      'login': 'Sign In',
      'register': 'Register',
      'logout': 'Sign Out',
      'email': 'Email',
      'password': 'Password',
      'confirmPassword': 'Confirm Password',
      'name': 'Name',
      'city': 'City',
      'language': 'Language',
      'settings': 'Settings',
      'yourStats': 'Your Stats',
      'totalScans': 'Total Scans',
      'thisWeek': 'This Week',
      'productsAvoided': 'Products Avoided',
      'alternativesFound': 'Alternatives Found',
      'badges': 'Badges',
      'submissions': 'Submissions',
      'leaderboard': 'Leaderboard',
      'level': 'Level',
      'points': 'points',
      'back': 'Back',
      'viewAll': 'View all',
      'noResults': 'No results found',
      'productNotFound': 'Product Not Found',
      'suggestProduct': 'Suggest this product',
      'loading': 'Loading...',
      'error': 'An error occurred',
      'retry': 'Retry',
      'selectCity': 'Select City',
      'tripoli': 'Tripoli',
      'benghazi': 'Benghazi',
      'misrata': 'Misrata',
      'noAccount': "Don't have an account?",
      'haveAccount': 'Already have an account?',
      'welcomeBack': 'Welcome back',
      'createAccount': 'Create a new account',
      'welcome': 'Welcome to Boycott',
      'appTagline': 'Know the product... and swap it for an alternative',
      'browseByCategory': 'Browse by Category',
      'mostAvailable': 'Most Available in Your City',
      'didYouKnow': 'Did You Know?',
      'popularSwaps': 'Popular Swaps',
      'from': 'From',
      'to': 'To',
      'alternativeTo': 'Alternative to',
      'confirmations': 'confirmations',
      'ownedBrands': 'Owned Brands',
      'alsoOwns': 'Also owns',
      'ownedBy': 'Owned by',
      'noClaims': 'No claims recorded',
      'noAlternatives': 'No alternatives recorded',
      'helpAddInfo': 'Help us add info',
      'signInToParticipate': 'Sign in to participate in the community',
      'submit': 'Submit',
      'mySubmissions': 'My Submissions',
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'contribution': 'contribution',
      'scans': 'scans',
      'accountSettings': 'Account Settings',
      'noSubmissions': 'No submissions yet',
      'submitFirst': 'Submit your first suggestion',
    },
  };

  String get appName => _localizedValues[locale.languageCode]!['appName']!;
  String get home => _localizedValues[locale.languageCode]!['home']!;
  String get discover => _localizedValues[locale.languageCode]!['discover']!;
  String get community => _localizedValues[locale.languageCode]!['community']!;
  String get profile => _localizedValues[locale.languageCode]!['profile']!;
  String get scan => _localizedValues[locale.languageCode]!['scan']!;
  String get search => _localizedValues[locale.languageCode]!['search']!;
  String get searchHint => _localizedValues[locale.languageCode]!['searchHint']!;
  String get scanProduct => _localizedValues[locale.languageCode]!['scanProduct']!;
  String get pointCameraAtBarcode => _localizedValues[locale.languageCode]!['pointCameraAtBarcode']!;
  String get recentScans => _localizedValues[locale.languageCode]!['recentScans']!;
  String get trending => _localizedValues[locale.languageCode]!['trending']!;
  String get alternatives => _localizedValues[locale.languageCode]!['alternatives']!;
  String get why => _localizedValues[locale.languageCode]!['why']!;
  String get ownershipChain => _localizedValues[locale.languageCode]!['ownershipChain']!;
  String get whereToBuy => _localizedValues[locale.languageCode]!['whereToBuy']!;
  String get shareInfo => _localizedValues[locale.languageCode]!['shareInfo']!;
  String get avoid => _localizedValues[locale.languageCode]!['avoid']!;
  String get caution => _localizedValues[locale.languageCode]!['caution']!;
  String get preferred => _localizedValues[locale.languageCode]!['preferred']!;
  String get unknown => _localizedValues[locale.languageCode]!['unknown']!;
  String get confidence => _localizedValues[locale.languageCode]!['confidence']!;
  String get status => _localizedValues[locale.languageCode]!['status']!;
  String get lastReview => _localizedValues[locale.languageCode]!['lastReview']!;
  String get exactMatch => _localizedValues[locale.languageCode]!['exactMatch']!;
  String get claims => _localizedValues[locale.languageCode]!['claims']!;
  String get sources => _localizedValues[locale.languageCode]!['sources']!;
  String get brands => _localizedValues[locale.languageCode]!['brands']!;
  String get products => _localizedValues[locale.languageCode]!['products']!;
  String get stores => _localizedValues[locale.languageCode]!['stores']!;
  String get lastConfirmed => _localizedValues[locale.languageCode]!['lastConfirmed']!;
  String get openMap => _localizedValues[locale.languageCode]!['openMap']!;
  String get login => _localizedValues[locale.languageCode]!['login']!;
  String get register => _localizedValues[locale.languageCode]!['register']!;
  String get logout => _localizedValues[locale.languageCode]!['logout']!;
  String get email => _localizedValues[locale.languageCode]!['email']!;
  String get password => _localizedValues[locale.languageCode]!['password']!;
  String get confirmPassword => _localizedValues[locale.languageCode]!['confirmPassword']!;
  String get name => _localizedValues[locale.languageCode]!['name']!;
  String get city => _localizedValues[locale.languageCode]!['city']!;
  String get language => _localizedValues[locale.languageCode]!['language']!;
  String get settings => _localizedValues[locale.languageCode]!['settings']!;
  String get yourStats => _localizedValues[locale.languageCode]!['yourStats']!;
  String get totalScans => _localizedValues[locale.languageCode]!['totalScans']!;
  String get thisWeek => _localizedValues[locale.languageCode]!['thisWeek']!;
  String get productsAvoided => _localizedValues[locale.languageCode]!['productsAvoided']!;
  String get alternativesFound => _localizedValues[locale.languageCode]!['alternativesFound']!;
  String get badges => _localizedValues[locale.languageCode]!['badges']!;
  String get submissions => _localizedValues[locale.languageCode]!['submissions']!;
  String get leaderboard => _localizedValues[locale.languageCode]!['leaderboard']!;
  String get level => _localizedValues[locale.languageCode]!['level']!;
  String get points => _localizedValues[locale.languageCode]!['points']!;
  String get back => _localizedValues[locale.languageCode]!['back']!;
  String get viewAll => _localizedValues[locale.languageCode]!['viewAll']!;
  String get noResults => _localizedValues[locale.languageCode]!['noResults']!;
  String get productNotFound => _localizedValues[locale.languageCode]!['productNotFound']!;
  String get suggestProduct => _localizedValues[locale.languageCode]!['suggestProduct']!;
  String get loading => _localizedValues[locale.languageCode]!['loading']!;
  String get error => _localizedValues[locale.languageCode]!['error']!;
  String get retry => _localizedValues[locale.languageCode]!['retry']!;
  String get selectCity => _localizedValues[locale.languageCode]!['selectCity']!;
  String get welcome => _localizedValues[locale.languageCode]!['welcome']!;
  String get appTagline => _localizedValues[locale.languageCode]!['appTagline']!;
  String get noAccount => _localizedValues[locale.languageCode]!['noAccount']!;
  String get haveAccount => _localizedValues[locale.languageCode]!['haveAccount']!;
  String get welcomeBack => _localizedValues[locale.languageCode]!['welcomeBack']!;
  String get createAccount => _localizedValues[locale.languageCode]!['createAccount']!;
  String get browseByCategory => _localizedValues[locale.languageCode]!['browseByCategory']!;
  String get didYouKnow => _localizedValues[locale.languageCode]!['didYouKnow']!;
  String get signInToParticipate => _localizedValues[locale.languageCode]!['signInToParticipate']!;
  String get submit => _localizedValues[locale.languageCode]!['submit']!;
  String get pending => _localizedValues[locale.languageCode]!['pending']!;
  String get approved => _localizedValues[locale.languageCode]!['approved']!;
  String get rejected => _localizedValues[locale.languageCode]!['rejected']!;
  String get popularSwaps => _localizedValues[locale.languageCode]!['popularSwaps']!;
  String get accountSettings => _localizedValues[locale.languageCode]!['accountSettings']!;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['ar', 'en'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

