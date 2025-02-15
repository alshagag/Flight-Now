// app/files/page.tsx
import fs from 'fs';
import path from 'path';

export default async function FilesPage() {
  // Define the folder path you want to browse (app folder in this case)
  const folderPath = path.join(process.cwd(), 'app');
  
  // Get all files recursively inside the folder
  const files = getFilesRecursive(folderPath);
  
  // Filter files based on their extension type (JavaScript and TypeScript files)
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const tsFiles = files.filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

  return (
    <div>
      <h1>Project Files</h1>
      
      {/* Display JavaScript files */}
      <h2>JavaScript Files</h2>
      <ul>
        {jsFiles.map((file, index) => (
          <li key={index}>{file.replace(process.cwd() + '\\app\\', '')}</li> // Show file paths relative to the 'app' folder
        ))}
      </ul>
      
      {/* Display TypeScript files */}
      <h2>TypeScript Files</h2>
      <ul>
        {tsFiles.map((file, index) => (
          <li key={index}>{file.replace(process.cwd() + '\\app\\', '')}</li> // Show file paths relative to the 'app' folder
        ))}
      </ul>
    </div>
  );
}

// Recursive function to get all files from a directory and its subdirectories
function getFilesRecursive(dirPath: string): string[] {
  let results: string[] = [];
  
  // Read the contents of the directory
  const list = fs.readdirSync(dirPath);

  // Loop through each file or folder inside the directory
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath); // Get stats for the file/folder

    // If it's a directory, recursively fetch its files
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursive(filePath));
    } else {
      // If it's a file, add it to the results array
      results.push(filePath);
    }
  });

  return results;
}
