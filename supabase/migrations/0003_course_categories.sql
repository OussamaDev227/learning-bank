-- Course categories ("banks") ----------------------------------------------
-- Lets a course be tagged to one of the 8 language-science banks shown on the
-- homepage (or 'عام' for the generic learning track). Reuses the existing
-- courses/lessons/quizzes engine instead of building a parallel content type
-- per bank.

alter table courses
  add column category text not null default 'عام'
  check (category in ('النحو', 'الصرف', 'البلاغة', 'الإملاء', 'الأصوات', 'المعجم والدلالة', 'الأدب', 'العروض', 'عام'));
