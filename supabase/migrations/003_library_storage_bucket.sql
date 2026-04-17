-- Resource library files: public read; upload only via Dashboard (or service role).
-- Expected object layout (bucket id = library):
--   pdfs/<id>.pdf     — checklist/guide rows with format PDF (id matches app resource id)
--   videos/<id>.mp4   — video rows
--   articles/<id>.html — article rows (served as static HTML)
--
-- After applying: Storage → library → upload files, then set VITE_LIBRARY_USE_STORAGE=true in the web app.

insert into storage.buckets (id, name, public, file_size_limit)
values ('library', 'library', true, 52428800)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "library_select_public" on storage.objects;
create policy "library_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'library');
