# Google Drive Integration with Service Account

This module provides integration with Google Drive API for file management operations:
- File upload
- File download
- Folder creation and management
- File search
- File metadata retrieval
- File sharing and permissions

## Setup Instructions

### 1. Set Up Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API for your project:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

### 2. Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name and description for the service account
4. Click "Create and Continue"
5. Assign roles to the service account (e.g., Project > Editor)
6. Click "Continue" and then "Done"

### 3. Generate Service Account Key

1. In the Service Accounts list, find the service account you just created
2. Click the three dots menu (Actions) and select "Manage keys"
3. Click "Add Key" > "Create new key"
4. Choose JSON as the key type and click "Create"
5. The key file will be automatically downloaded to your computer

### 4. Configure the Application

1. Rename the downloaded key file to `service-account-key.json`
2. Place it in the `src/main/resources` directory
3. Make sure the `google.service-account.key-file` property in `application.yml` points to the correct location

### 5. Create a Shared Drive (Optional)

For enhanced collaboration:

1. Go to Google Drive and create a new Shared Drive
2. Share the Shared Drive with the service account's email address (found in the key file)

## Service Account Authentication

Unlike OAuth 2.0, service account authentication:
- Doesn't require user interaction
- Operates on behalf of the service account rather than a user
- Is ideal for server-to-server applications
- Uses a private key for authentication
- Doesn't require token renewal

## File Sharing and Permissions

Since the service account owns the files it creates, you can use the provided methods to:

1. Share files with specific users by email
2. Share files with entire domains
3. Make files publicly accessible

## Usage Examples

### Upload a File

```bash
curl -X POST http://localhost:8080/api/v1/drive/upload \
  -F "file=@/path/to/your/file.txt" \
  -F "mimeType=text/plain" \
  -F "description=My file description"
```

### Create a Folder

```bash
curl -X POST http://localhost:8080/api/v1/drive/folders \
  -F "name=My Folder"
```

### List Files

```bash
curl -X GET http://localhost:8080/api/v1/drive/files
```

### Download a File

```bash
curl -X GET http://localhost:8080/api/v1/drive/download/{fileId} --output downloaded_file
```

### Share a File with a User

```bash
curl -X POST http://localhost:8080/api/v1/drive/{fileId}/share/user \
  -F "email=user@example.com" \
  -F "role=writer"
```

### Make a File Public

```bash
curl -X POST http://localhost:8080/api/v1/drive/{fileId}/share/public \
  -F "role=reader"
```

## Security Considerations

- The service account has its own identity and access to all files it creates
- Protect the service account key file as it grants full access to your Google Drive data
- Consider using environment variables or a secrets manager to store the key in production
- Use the principle of least privilege and assign only necessary roles to the service account
- For enhanced security, use Domain-Wide Delegation with admin consent for specific scopes
- Implement proper access control in your application to prevent unauthorized use of the API endpoints 