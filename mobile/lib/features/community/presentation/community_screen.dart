import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/l10n/app_localizations.dart';

class CommunityScreen extends ConsumerWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l10n.community,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'شارك وساهم معنا',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add),
                label: Text(l10n.submit),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Sign in prompt
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.preferredLight,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.preferred.withOpacity(0.3)),
            ),
            child: Column(
              children: [
                Text(
                  l10n.signInToParticipate,
                  style: const TextStyle(color: AppColors.primaryDark),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ElevatedButton(
                      onPressed: () => context.push('/login'),
                      child: Text(l10n.login),
                    ),
                    const SizedBox(width: 12),
                    OutlinedButton(
                      onPressed: () => context.push('/register'),
                      child: Text(l10n.register),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Tabs
          DefaultTabController(
            length: 2,
            child: Column(
              children: [
                TabBar(
                  labelColor: AppColors.primary,
                  unselectedLabelColor: AppColors.textTertiary,
                  indicatorColor: AppColors.primary,
                  tabs: [
                    Tab(text: l10n.submissions),
                    Tab(text: l10n.leaderboard),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  height: 400,
                  child: TabBarView(
                    children: [
                      // Submissions tab
                      _SubmissionsList(l10n: l10n),
                      // Leaderboard tab
                      _LeaderboardList(l10n: l10n),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SubmissionsList extends StatelessWidget {
  final AppLocalizations l10n;

  const _SubmissionsList({required this.l10n});

  @override
  Widget build(BuildContext context) {
    // Mock data
    final submissions = [
      {'name': 'Ahmed', 'type': 'product', 'status': 'PENDING'},
      {'name': 'Sara', 'type': 'company', 'status': 'APPROVED'},
      {'name': 'Omar', 'type': 'product', 'status': 'REJECTED'},
    ];

    return ListView.builder(
      itemCount: submissions.length,
      itemBuilder: (context, index) {
        final item = submissions[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(
                  color: AppColors.border,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    item['name']![0],
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['name']!,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      'نوع: ${item['type']}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: item['status'] == 'APPROVED'
                      ? AppColors.preferredLight
                      : item['status'] == 'REJECTED'
                          ? AppColors.avoidLight
                          : const Color(0xFFDBEAFE),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  item['status'] == 'APPROVED'
                      ? l10n.approved
                      : item['status'] == 'REJECTED'
                          ? l10n.rejected
                          : l10n.pending,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: item['status'] == 'APPROVED'
                        ? AppColors.preferred
                        : item['status'] == 'REJECTED'
                            ? AppColors.avoid
                            : const Color(0xFF2563EB),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _LeaderboardList extends StatelessWidget {
  final AppLocalizations l10n;

  const _LeaderboardList({required this.l10n});

  @override
  Widget build(BuildContext context) {
    // Mock data
    final leaderboard = [
      {'name': 'محمد أحمد', 'points': 1250, 'level': 3},
      {'name': 'سارة علي', 'points': 980, 'level': 2},
      {'name': 'أحمد محمود', 'points': 756, 'level': 2},
      {'name': 'فاطمة حسن', 'points': 520, 'level': 1},
    ];

    return ListView.builder(
      itemCount: leaderboard.length,
      itemBuilder: (context, index) {
        final item = leaderboard[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: index == 0
                      ? const Color(0xFFFEF3C7)
                      : index == 1
                          ? const Color(0xFFF3F4F6)
                          : index == 2
                              ? const Color(0xFFFED7AA)
                              : AppColors.border,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    '${index + 1}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: index == 0
                          ? const Color(0xFFB45309)
                          : index == 1
                              ? AppColors.textSecondary
                              : index == 2
                                  ? const Color(0xFFC2410C)
                                  : AppColors.textSecondary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primaryLight.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    item['name'].toString()[0],
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryDark,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['name'] as String,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      '${l10n.level} ${item['level']}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${item['points']}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  Text(
                    l10n.points,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

