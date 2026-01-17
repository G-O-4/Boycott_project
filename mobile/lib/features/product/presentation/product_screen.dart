import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../common/widgets/verdict_badge.dart';
import '../../stores/presentation/store_map_sheet.dart';

class AlternativeProduct {
  final String id;
  final String nameAr;
  final String nameEn;
  final String brandNameAr;
  final String brandNameEn;
  final bool isExact;
  final List<StoreInfo> stores;

  AlternativeProduct({
    required this.id,
    required this.nameAr,
    required this.nameEn,
    required this.brandNameAr,
    required this.brandNameEn,
    this.isExact = false,
    required this.stores,
  });
}

class ProductScreen extends ConsumerWidget {
  final String productId;

  const ProductScreen({super.key, required this.productId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;

    // Demo product data
    final product = {
      'id': productId,
      'nameAr': 'كوكا كولا',
      'nameEn': 'Coca Cola',
      'barcode': '5449000000996',
      'verdict': 'AVOID',
      'confidence': 95,
      'brandNameAr': 'كوكا كولا',
      'brandNameEn': 'Coca-Cola',
      'companyId': '1',
      'companyNameAr': 'شركة كوكا كولا',
      'companyNameEn': 'The Coca-Cola Company',
    };

    final alternatives = [
      AlternativeProduct(
        id: '2',
        nameAr: 'آر سي كولا',
        nameEn: 'RC Cola',
        brandNameAr: 'آر سي',
        brandNameEn: 'RC',
        isExact: true,
        stores: [
          StoreInfo(id: 's1', name: 'Al-Riyada', nameAr: 'سوبر ماركت الريادة', address: 'شارع الجمهورية', city: 'طرابلس', lat: 32.8872, lng: 13.1913, priceMin: 3.5, priceMax: 4.5, currency: 'د.ل', lastConfirmed: '2024-01-15'),
          StoreInfo(id: 's2', name: 'Al-Amal', nameAr: 'متجر الأمل', address: 'منطقة السراج', city: 'طرابلس', lat: 32.8752, lng: 13.1763, priceMin: 3.0, priceMax: 4.0, currency: 'د.ل', lastConfirmed: '2024-01-10'),
          StoreInfo(id: 's3', name: 'Al-Najma', nameAr: 'سوبر ماركت النجمة', address: 'شارع عمر المختار', city: 'بنغازي', lat: 32.1194, lng: 20.0868, priceMin: 3.5, priceMax: 5.0, currency: 'د.ل', lastConfirmed: '2024-01-12'),
        ],
      ),
      AlternativeProduct(
        id: '3',
        nameAr: 'بيبيتا',
        nameEn: 'Pepita',
        brandNameAr: 'بيبيتا',
        brandNameEn: 'Pepita',
        isExact: false,
        stores: [
          StoreInfo(id: 's4', name: 'Unity', nameAr: 'سوبر ماركت الوحدة', address: 'وسط المدينة', city: 'مصراتة', lat: 32.3754, lng: 15.0925, priceMin: 2.5, priceMax: 3.5, currency: 'د.ل', lastConfirmed: '2024-01-08'),
        ],
      ),
    ];

    final claims = [
      {
        'titleAr': 'دعم الاحتلال',
        'titleEn': 'Support for occupation',
        'descriptionAr': 'الشركة لها استثمارات ونشاط تجاري يدعم الاحتلال',
        'issueType': 'DIRECT_SUPPORT',
        'confidence': 'HIGH',
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 0,
            floating: true,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
            ),
            title: Text(product['nameAr'] as String),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Product Header Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border, width: 0.5),
                  ),
                  child: Column(
                    children: [
                      // Product info
                      Row(
                        children: [
                          Container(
                            width: 72,
                            height: 72,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceVariant,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Center(
                              child: Text('📦', style: TextStyle(fontSize: 32)),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  product['nameAr'] as String,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  product['brandNameAr'] as String,
                                  style: const TextStyle(
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => context.push('/company/${product['companyId']}'),
                                  child: Text(
                                    product['companyNameAr'] as String,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Verdict
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: VerdictStyles.getBackgroundColor(product['verdict'] as String),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Column(
                          children: [
                            Text(
                              VerdictStyles.getIcon(product['verdict'] as String),
                              style: TextStyle(
                                fontSize: 40,
                                color: VerdictStyles.getColor(product['verdict'] as String),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'تجنب هذا المنتج',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: VerdictStyles.getColor(product['verdict'] as String),
                              ),
                            ),
                            Text(
                              'الثقة: ${product['confidence']}%',
                              style: TextStyle(
                                fontSize: 13,
                                color: VerdictStyles.getColor(product['verdict'] as String).withAlpha(180),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Why section
                _SectionTitle(title: l10n.why, color: AppColors.caution),
                const SizedBox(height: 12),
                ...claims.map((claim) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border, width: 0.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        claim['titleAr'] as String,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        claim['descriptionAr'] as String,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.avoidLight,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'دعم مباشر',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.avoid,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                )),
                const SizedBox(height: 24),

                // Alternatives section
                _SectionTitle(title: l10n.alternatives, color: AppColors.preferred),
                const SizedBox(height: 12),
                ...alternatives.map((alt) => _AlternativeCard(
                  alternative: alt,
                  onShowStores: () {
                    StoreMapSheet.show(
                      context,
                      productName: alt.nameAr,
                      stores: alt.stores,
                    );
                  },
                )),
                const SizedBox(height: 24),

                // Ownership chain link
                Material(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                  child: InkWell(
                    onTap: () => context.push('/company/${product['companyId']}'),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.border, width: 0.5),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          const Text('🔗', style: TextStyle(fontSize: 28)),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  l10n.ownershipChain,
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                                const Text(
                                  'اكتشف من يملك هذه العلامة التجارية',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.chevron_left, color: AppColors.textTertiary),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 40),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  final Color color;

  const _SectionTitle({required this.title, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 20,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 10),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

class _AlternativeCard extends StatelessWidget {
  final AlternativeProduct alternative;
  final VoidCallback onShowStores;

  const _AlternativeCard({
    required this.alternative,
    required this.onShowStores,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border, width: 0.5),
      ),
      child: Column(
        children: [
          // Product info
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.preferredLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Center(
                  child: Text(
                    '✓',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.preferred,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          alternative.nameAr,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                        ),
                        if (alternative.isExact) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withAlpha(30),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'مطابق',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppColors.primary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    Text(
                      alternative.brandNameAr,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              VerdictBadge(verdict: 'PREFERRED', size: VerdictBadgeSize.small),
            ],
          ),
          const SizedBox(height: 14),

          // Where to buy
          Container(
            padding: const EdgeInsets.only(top: 14),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 20, color: AppColors.primary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'متوفر في ${alternative.stores.length} متجر',
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ),
                TextButton(
                  onPressed: onShowStores,
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                  ),
                  child: const Text('أين أجده؟'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
