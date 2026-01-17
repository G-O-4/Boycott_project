export const claims = [
  {
    titleEn: 'Financial support for Israeli military operations',
    titleAr: 'دعم مالي للعمليات العسكرية الإسرائيلية',
    descriptionEn: 'The company has been documented providing financial support, donations, or investments that benefit the Israeli military or settlements in occupied Palestinian territories.',
    descriptionAr: 'تم توثيق تقديم الشركة دعم مالي أو تبرعات أو استثمارات تفيد الجيش الإسرائيلي أو المستوطنات في الأراضي الفلسطينية المحتلة.',
    issueType: 'OCCUPATION' as const,
    companies: ['The Coca-Cola Company', 'PepsiCo', "McDonald's Corporation", 'Starbucks Corporation'],
    evidenceSources: [
      {
        url: 'https://bdsmovement.net/get-involved/what-to-boycott',
        title: 'BDS Movement - What to Boycott',
        publisher: 'BDS Movement',
        publishedDate: '2024-01-01',
      },
    ],
  },
  {
    titleEn: 'Operations in illegal Israeli settlements',
    titleAr: 'عمليات في المستوطنات الإسرائيلية غير القانونية',
    descriptionEn: 'The company operates facilities, factories, or stores in Israeli settlements built on occupied Palestinian land, which are illegal under international law.',
    descriptionAr: 'تدير الشركة منشآت أو مصانع أو متاجر في المستوطنات الإسرائيلية المبنية على الأراضي الفلسطينية المحتلة، وهي غير قانونية بموجب القانون الدولي.',
    issueType: 'OCCUPATION' as const,
    companies: ['HP Inc.', 'Nestlé'],
    evidenceSources: [
      {
        url: 'https://www.whoprofits.org/',
        title: 'Who Profits Research Center',
        publisher: 'Who Profits',
        publishedDate: '2024-01-01',
      },
    ],
  },
  {
    titleEn: 'Providing technology/services to Israeli military',
    titleAr: 'تقديم تكنولوجيا/خدمات للجيش الإسرائيلي',
    descriptionEn: 'The company provides technology, equipment, or services that are used by the Israeli military or security forces in operations against Palestinians.',
    descriptionAr: 'تقدم الشركة تكنولوجيا أو معدات أو خدمات يستخدمها الجيش أو قوات الأمن الإسرائيلية في العمليات ضد الفلسطينيين.',
    issueType: 'OCCUPATION' as const,
    companies: ['HP Inc.'],
    evidenceSources: [
      {
        url: 'https://bdsmovement.net/hp',
        title: 'HP and Israeli Apartheid',
        publisher: 'BDS Movement',
        publishedDate: '2024-01-01',
      },
    ],
  },
  {
    titleEn: 'Sponsorship of Israeli sports teams in settlements',
    titleAr: 'رعاية فرق رياضية إسرائيلية في المستوطنات',
    descriptionEn: 'The company sponsors or partners with Israeli sports teams that operate in illegal settlements or that are associated with the occupation.',
    descriptionAr: 'ترعى الشركة أو تتشارك مع فرق رياضية إسرائيلية تعمل في مستوطنات غير قانونية أو مرتبطة بالاحتلال.',
    issueType: 'OCCUPATION' as const,
    companies: ['Puma SE'],
    evidenceSources: [
      {
        url: 'https://bdsmovement.net/puma',
        title: 'Boycott Puma Campaign',
        publisher: 'BDS Movement',
        publishedDate: '2024-01-01',
      },
    ],
  },
  {
    titleEn: 'Public statements supporting Israeli actions',
    titleAr: 'تصريحات علنية داعمة للإجراءات الإسرائيلية',
    descriptionEn: 'Company leadership has made public statements supporting Israeli military actions or policies that affect Palestinians.',
    descriptionAr: 'أدلت قيادة الشركة بتصريحات علنية تدعم الإجراءات العسكرية أو السياسات الإسرائيلية التي تؤثر على الفلسطينيين.',
    issueType: 'HUMAN_RIGHTS' as const,
    companies: ['Starbucks Corporation', "McDonald's Corporation"],
    evidenceSources: [
      {
        url: 'https://www.aljazeera.com/news/boycott-israel',
        title: 'Companies facing boycott calls',
        publisher: 'Al Jazeera',
        publishedDate: '2024-01-01',
      },
    ],
  },
  {
    titleEn: 'Investment in Israeli economy benefiting occupation',
    titleAr: 'استثمار في الاقتصاد الإسرائيلي يفيد الاحتلال',
    descriptionEn: 'The company has significant investments or business operations in Israel that contribute to the economy supporting the occupation.',
    descriptionAr: 'لدى الشركة استثمارات كبيرة أو عمليات تجارية في إسرائيل تساهم في الاقتصاد الداعم للاحتلال.',
    issueType: 'FUNDING' as const,
    companies: ['Nestlé', 'Procter & Gamble', "L'Oréal", 'Johnson & Johnson', 'Mondelez International'],
    evidenceSources: [
      {
        url: 'https://www.whoprofits.org/companies',
        title: 'Company Database',
        publisher: 'Who Profits',
        publishedDate: '2024-01-01',
      },
    ],
  },
];

