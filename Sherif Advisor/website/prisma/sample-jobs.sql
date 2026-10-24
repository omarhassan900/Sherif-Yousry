-- Sample career openings for the Careers page (type = 'job', published).
SET NAMES utf8mb4;

-- Remove the earlier throwaway test job (department "dsadas").
DELETE FROM `ContentItem`
WHERE `type` = 'job'
  AND JSON_UNQUOTE(JSON_EXTRACT(`metadata`, '$.department')) = 'dsadas';

INSERT INTO `ContentItem`
  (`id`, `type`, `titleAr`, `titleEn`, `bodyAr`, `bodyEn`, `status`, `metadata`, `createdById`, `updatedById`, `createdAt`, `updatedAt`)
VALUES
(
  'job_sample_tax_0001', 'job',
  'مستشار ضريبي أول', 'Senior Tax Consultant',
  '<p>قُد ارتباطات ضريبية معقدة وقدّم استشارات استراتيجية لعملاء من مختلف القطاعات مع ضمان الامتثال الكامل للتشريعات المحلية والدولية.</p>',
  '<p>Lead complex tax engagements and deliver strategic advisory to clients across sectors, while ensuring full compliance with local and international legislation.</p>',
  'published',
  JSON_OBJECT(
    'department', 'Tax', 'departmentAr', 'الضرائب',
    'location', 'New Cairo, Egypt', 'locationAr', 'القاهرة الجديدة، مصر',
    'jobType', 'Full-time', 'icon', 'Calculator', 'displayOrder', 1,
    'responsibilitiesEn', JSON_ARRAY(
      'Manage client tax portfolios and provide integrated advisory.',
      'Review tax returns to ensure accuracy and compliance.',
      'Handle tax disputes before the relevant authorities.',
      'Mentor and develop junior consultants.'
    ),
    'responsibilitiesAr', JSON_ARRAY(
      'إدارة محافظ العملاء الضريبية وتقديم استشارات متكاملة.',
      'مراجعة الإقرارات الضريبية وضمان دقتها والتزامها.',
      'التعامل مع المنازعات الضريبية أمام الجهات المختصة.',
      'توجيه وتطوير فريق المستشارين المبتدئين.'
    ),
    'requirementsEn', JSON_ARRAY(
      'Minimum 5 years of experience in tax advisory.',
      'Deep knowledge of Egyptian tax law and e-invoicing.',
      'Fluency in Arabic and English, written and spoken.'
    ),
    'requirementsAr', JSON_ARRAY(
      'خبرة لا تقل عن 5 سنوات في الاستشارات الضريبية.',
      'إلمام عميق بقانون الضرائب المصري والفاتورة الإلكترونية.',
      'إجادة العربية والإنجليزية تحدثاً وكتابة.'
    ),
    'image', '/images/bg-3.jpeg', 'imageId', NULL
  ),
  'cadmini0o95r2vx5mux5f59q', 'cadmini0o95r2vx5mux5f59q', NOW(3), NOW(3)
),
(
  'job_sample_legal_0002', 'job',
  'محامي شركات', 'Corporate Lawyer',
  '<p>قدّم المشورة القانونية في مجالات حوكمة الشركات والعقود والامتثال التنظيمي لمجموعة متنوعة من العملاء.</p>',
  '<p>Provide legal counsel across corporate governance, contracts, and regulatory compliance for a diverse client base.</p>',
  'published',
  JSON_OBJECT(
    'department', 'Legal', 'departmentAr', 'القانوني',
    'location', 'New Cairo, Egypt', 'locationAr', 'القاهرة الجديدة، مصر',
    'jobType', 'Full-time', 'icon', 'Scale', 'displayOrder', 2,
    'responsibilitiesEn', JSON_ARRAY(
      'Draft and review commercial contracts and agreements.',
      'Advise on company formation and restructuring.',
      'Oversee regulatory compliance and governance.'
    ),
    'responsibilitiesAr', JSON_ARRAY(
      'صياغة ومراجعة العقود والاتفاقيات التجارية.',
      'تقديم المشورة في تأسيس الشركات وإعادة الهيكلة.',
      'متابعة الامتثال التنظيمي والحوكمة.'
    ),
    'requirementsEn', JSON_ARRAY(
      'Minimum 4 years of experience in corporate law.',
      'Active bar association membership.',
      'Strong negotiation and legal analysis skills.'
    ),
    'requirementsAr', JSON_ARRAY(
      'خبرة لا تقل عن 4 سنوات في قانون الشركات.',
      'عضوية نقابة المحامين سارية.',
      'مهارات تفاوض وتحليل قانوني قوية.'
    ),
    'image', '/images/bg-4.jpeg', 'imageId', NULL
  ),
  'cadmini0o95r2vx5mux5f59q', 'cadmini0o95r2vx5mux5f59q', NOW(3), NOW(3)
),
(
  'job_sample_analyst_0003', 'job',
  'محلل مالي', 'Financial Analyst',
  '<p>حلّل البيانات المالية وأعدّ النماذج والتوقعات التي تدعم قرارات الاستثمار ودراسات الجدوى لعملائنا.</p>',
  '<p>Analyze financial data and build the models and forecasts that support investment decisions and feasibility studies for our clients.</p>',
  'published',
  JSON_OBJECT(
    'department', 'Finance', 'departmentAr', 'التمويل',
    'location', 'Remote', 'locationAr', 'عن بُعد',
    'jobType', 'Full-time', 'icon', 'BarChart2', 'displayOrder', 3,
    'responsibilitiesEn', JSON_ARRAY(
      'Build financial models and forecasts.',
      'Analyze financial statements and performance metrics.',
      'Contribute to feasibility studies and investment appraisals.'
    ),
    'responsibilitiesAr', JSON_ARRAY(
      'إعداد النماذج المالية والتوقعات.',
      'تحليل القوائم المالية ومؤشرات الأداء.',
      'المساهمة في دراسات الجدوى وتقييم الاستثمارات.'
    ),
    'requirementsEn', JSON_ARRAY(
      '2 to 4 years of experience in financial analysis.',
      'Proficiency in Excel and financial modeling.',
      'A CFA certification or equivalent is a plus.'
    ),
    'requirementsAr', JSON_ARRAY(
      'خبرة من 2 إلى 4 سنوات في التحليل المالي.',
      'إتقان Excel ونمذجة البيانات المالية.',
      'شهادة CFA أو ما يعادلها ميزة إضافية.'
    ),
    'image', '/images/bg-2.jpeg', 'imageId', NULL
  ),
  'cadmini0o95r2vx5mux5f59q', 'cadmini0o95r2vx5mux5f59q', NOW(3), NOW(3)
),
(
  'job_sample_hr_0004', 'job',
  'مدير موارد بشرية', 'HR Manager',
  '<p>قُد وظيفة الموارد البشرية بالكامل من الاستقطاب إلى تطوير المواهب وبناء ثقافة مؤسسية متميزة.</p>',
  '<p>Lead the full HR function from talent acquisition to development, building a distinguished organizational culture.</p>',
  'published',
  JSON_OBJECT(
    'department', 'Human Resources', 'departmentAr', 'الموارد البشرية',
    'location', 'New Cairo, Egypt', 'locationAr', 'القاهرة الجديدة، مصر',
    'jobType', 'Full-time', 'icon', 'Users', 'displayOrder', 4,
    'responsibilitiesEn', JSON_ARRAY(
      'Manage the recruitment and hiring cycle.',
      'Develop training programs and career paths.',
      'Oversee HR policies and compliance.'
    ),
    'responsibilitiesAr', JSON_ARRAY(
      'إدارة دورة الاستقطاب والتوظيف.',
      'تطوير برامج التدريب والمسارات الوظيفية.',
      'الإشراف على سياسات الموارد البشرية والامتثال.'
    ),
    'requirementsEn', JSON_ARRAY(
      'Minimum 5 years of experience in HR.',
      'Knowledge of Egyptian labor law.',
      'Excellent leadership and communication skills.'
    ),
    'requirementsAr', JSON_ARRAY(
      'خبرة لا تقل عن 5 سنوات في الموارد البشرية.',
      'معرفة بقانون العمل المصري.',
      'مهارات قيادية وتواصل ممتازة.'
    ),
    'image', '/images/Bussniess.jpeg', 'imageId', NULL
  ),
  'cadmini0o95r2vx5mux5f59q', 'cadmini0o95r2vx5mux5f59q', NOW(3), NOW(3)
);
