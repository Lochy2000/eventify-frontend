const fs = require('fs');
const path = require('path');

// Function to check if file exists with case-insensitive search
const checkFileExistsInsensitive = (basePath, relativePath) => {
  const normalizedPath = relativePath.replace(/\//g, path.sep);
  const fullPath = path.join(basePath, normalizedPath);
  const dir = path.dirname(fullPath);
  const base = path.basename(fullPath);

  try {
    // If directory doesn't exist, file can't exist
    if (!fs.existsSync(dir)) {
      return false;
    }
    
    // Read directory entries
    const files = fs.readdirSync(dir);
    
    // Check if any entry matches the filename (case-insensitive)
    return files.some(file => file.toLowerCase() === base.toLowerCase());
  } catch (err) {
    console.error(`Error checking file existence: ${err.message}`);
    return false;
  }
};

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
  // Convert import path to file path without the extension
  const relativePath = importPath.replace('./', '');
  const basePath = path.join(__dirname, 'src');
  
  // Check for JS file with case-insensitive search
  const fileExists = checkFileExistsInsensitive(basePath, `${relativePath}.js`) || 
                   checkFileExistsInsensitive(basePath, `${relativePath}.jsx`) || 
                   checkFileExistsInsensitive(basePath, `${relativePath}/index.js`);
  
  if (fileExists) {
    console.log(`\u2705 File exists (case-insensitive): ${relativePath}`);
  } else {
    console.error(`\u274c File not found: ${relativePath}`);
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
