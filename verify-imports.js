const fs = require('fs');
const path = require('path');

// List of expected imports in App.js
const expectedImports = [
  './components/common/NavBar',
  './components/common/Footer',
  './pages/auth/SignInForm',
  './pages/auth/SignUpForm',
  './pages/events/EventsPage',
  './pages/events/EventDetailPage',
  './pages/events/EventCreatePage',
  './pages/events/EventEditPage',
  './pages/events/EventAttendeesPage',
  './pages/ProfilePage',
  './pages/ProfileEditForm',
  './pages/PeoplePage',
  './pages/HomePage',
  './contexts/CurrentUserContext'
];

// Read App.js
const appJsPath = path.join(__dirname, 'src', 'App.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Check each import
console.log('Verifying imports in App.js...');
let allImportsExist = true;

expectedImports.forEach(importPath => {
  const searchText = `from '${importPath}'`;
  if (!appJsContent.includes(searchText)) {
    console.error(`❌ Import not found: ${importPath}`);
    allImportsExist = false;
  } else {
    console.log(`✅ Found import: ${importPath}`);
  }
});

// Check if files exist
console.log('\nVerifying file existence...');
let allFilesExist = true;

expectedImports.forEach(importPath => {
  // Convert import path to file path
  const filePath = path.join(__dirname, 'src', ...importPath.replace('./', '').split('/'));
  const jsFilePath = filePath + '.js';
  const jsxFilePath = filePath + '.jsx';
  const indexJsPath = path.join(filePath, 'index.js');
  
  if (fs.existsSync(jsFilePath)) {
    console.log(`✅ File exists: ${jsFilePath}`);
  } else if (fs.existsSync(jsxFilePath)) {
    console.log(`✅ File exists: ${jsxFilePath}`);
  } else if (fs.existsSync(indexJsPath)) {
    console.log(`✅ File exists: ${indexJsPath}`);
  } else {
    console.error(`❌ File not found: ${jsFilePath} or ${jsxFilePath} or ${indexJsPath}`);
    allFilesExist = false;
  }
});

// Summary
console.log('\nImport Verification Summary:');
console.log(`Import statements correct: ${allImportsExist ? '✅ Yes' : '❌ No'}`);
console.log(`All files exist: ${allFilesExist ? '✅ Yes' : '❌ No'}`);

if (!allImportsExist || !allFilesExist) {
  console.error('\n❌ Verification failed. Please fix the issues before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All imports are valid! You can deploy safely.');
}
