import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'transactions-types/edit/:id',
    loadChildren: () =>
      import('./transaction-type/transaction-type-page.module').then(
        (m) => m.TransactionTypePageModule
      ),
  },
  {
    path: 'transactions-types',
    loadChildren: () =>
      import('./transaction-type/list/transaction-type-list.module').then(
        (m) => m.TransactionTypeListPageModule
      ),
  },
  {
    path: 'users/lists',
    loadChildren: () =>
      import('./user/list/user-list.module').then((m) => m.UserListPageModule),
  },
  {
    path: 'users/new',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contact/list/contact-list.module').then(
        (m) => m.ContactListPageModule
      ),
  },
  {
    path: 'contacts/new',
    loadChildren: () =>
      import('./contact/contact-page.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'contacts/edit/:id',
    loadChildren: () =>
      import('./contact/contact-page.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'text-editor',
    loadChildren: () =>
      import('./text-editor/text-editor.module').then(
        (m) => m.TextEditorPageModule
      ),
  },
  {
    path: 'text-editor-list',
    loadChildren: () =>
      import('./text-editor/list/text-editor-list.module').then(
        (m) => m.TextEditorListPageModule
      ),
  },
  {
    path: 'doc-archive-list',
    loadChildren: () =>
      import('./document-archive/document-archive-list.module').then(
        (m) => m.DocumentArchiveListPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'recover/:recoverpassword',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'reader/:uuid',
    loadChildren: () =>
      import('./reader/reader.module').then((m) => m.ReaderPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'templates',
    loadChildren: () =>
      import('./document-template/list/document-template-list.module').then(
        (m) => m.DocumenTemplateListPageModule
      ),
  },
  {
    path: 'templates/new',
    loadChildren: () =>
      import('./document-template/document-template.module').then(
        (m) => m.DocumentTemplateModule
      ),
  },
  {
    path: 'templates/edit/:id',
    loadChildren: () =>
      import('./document-template/document-template.module').then(
        (m) => m.DocumentTemplateModule
      ),
  },
  {
    path: 'current-account',
    loadChildren: () =>
      import('./current-account/current-account.module').then(
        (m) => m.CurrentAccountPageModule
      ),
  },
  {
    path: 'download-file/:key',
    loadChildren: () =>
      import('./download-file/download-file.module').then(
        (m) => m.DownloadFilePageModule
      ),
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
