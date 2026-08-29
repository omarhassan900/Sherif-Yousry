# Requirements Document

## Introduction

The Admin Portal CMS provides a secure, bilingual content management system for Sherif Yousry Advisory. The CEO and authorized administrators can create, edit, and manage all public website content in both Arabic and English through a clean, intuitive interface. The public-facing website reads content from the database and renders it based on the visitor's selected language (Arabic or English).

## Glossary

- **Admin_Portal**: The protected web interface accessible at `/admin` where authorized administrators manage website content
- **Administrator**: An authenticated user with admin role privileges who can manage content through the Admin_Portal
- **Content_Item**: A single piece of managed content stored in the database with Arabic and English versions (e.g., a service description, article, or page section)
- **Content_Type**: A category of content with a defined structure (e.g., Service, Article, Page_Section, Contact_Info)
- **Auth_System**: The authentication and authorization module that verifies administrator identity and controls access to the Admin_Portal
- **Content_API**: The server-side API layer that handles CRUD operations on Content_Items and serves content to the public website
- **Public_Website**: The public-facing Next.js website that renders content from the database based on the visitor's language preference
- **Rich_Text_Editor**: The WYSIWYG editing component that allows administrators to format content without writing HTML
- **Media_Manager**: The component responsible for uploading, storing, and serving images and files used in content

## Requirements

### Requirement 1: Administrator Authentication

**User Story:** As an administrator, I want to securely log in to the Admin Portal, so that only authorized personnel can manage website content.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Admin_Portal URL, THE Auth_System SHALL display a login form requesting email (maximum 254 characters, validated as a well-formed email address) and password (maximum 128 characters)
2. WHEN valid credentials are submitted, THE Auth_System SHALL create an authenticated session and redirect the administrator to the Admin_Portal dashboard
3. WHEN invalid credentials are submitted, THE Auth_System SHALL display a generic error message without revealing whether the email or password was incorrect
4. WHILE an administrator session is active, THE Auth_System SHALL maintain the session for a maximum of 8 hours before requiring re-authentication, and WHEN the session expires during active use, THE Auth_System SHALL redirect the administrator to the login page on the next request
5. WHEN an administrator clicks the logout button, THE Auth_System SHALL invalidate the session and redirect to the login page
6. IF an unauthenticated user attempts to access any Admin_Portal route, THEN THE Auth_System SHALL redirect the user to the login page
7. IF an administrator submits 5 consecutive failed login attempts for the same email address within a 15-minute window, THEN THE Auth_System SHALL lock the account for 15 minutes and reject further login attempts for that email with a message indicating the account is temporarily locked

### Requirement 2: Administrator Management

**User Story:** As the primary administrator, I want to manage admin accounts, so that additional team members can be granted content management access in the future.

#### Acceptance Criteria

1. WHILE an administrator with account-management permission is authenticated, THE Admin_Portal SHALL display an administrator management section
2. WHEN an administrator creates a new admin account, THE Auth_System SHALL require a valid email address (maximum 254 characters), a display name (between 1 and 100 characters), and a system-generated temporary password
3. WHEN a new admin account is created, THE Auth_System SHALL send the temporary password to the new administrator via the provided email address
4. THE Auth_System SHALL enforce that passwords contain between 8 and 128 characters including at least one uppercase letter, one lowercase letter, and one digit
5. IF an administrator attempts to deactivate their own account, THEN THE Auth_System SHALL reject the request and display an error message indicating self-deactivation is not permitted
6. WHEN an administrator deactivates another admin account, THE Auth_System SHALL immediately invalidate all active sessions for that account and prevent future logins for that account
7. WHEN a new administrator logs in with a temporary password, THE Auth_System SHALL require the administrator to set a new password before granting access to the Admin_Portal
8. IF an administrator attempts to create an account with an email address already associated with an existing account, THEN THE Auth_System SHALL reject the request and display an error message indicating the email is already in use

### Requirement 3: Content Dashboard

**User Story:** As an administrator, I want a clear overview of all website content, so that I can quickly find and manage any content piece.

#### Acceptance Criteria

1. WHEN an administrator logs in successfully, THE Admin_Portal SHALL display a dashboard showing content statistics including total Content_Items per Content_Type and the 10 most recently modified Content_Items sorted by last-modified date in descending order
2. THE Admin_Portal SHALL display a sidebar navigation with links to each Content_Type management section
3. WHEN an administrator selects a Content_Type from the navigation, THE Admin_Portal SHALL display a paginated list of Content_Items of that type showing title in both Arabic and English, status, and last-modified date, sorted by last-modified date in descending order with a maximum of 20 items per page
4. WHEN an administrator enters at least 2 characters in the search field, THE Admin_Portal SHALL filter displayed Content_Items by matching the search term against titles in both Arabic and English
5. IF a search or Content_Type filter returns no matching Content_Items, THEN THE Admin_Portal SHALL display a message indicating that no items were found

### Requirement 4: Bilingual Content Creation

**User Story:** As an administrator, I want to create content in both Arabic and English simultaneously, so that the public website can serve visitors in their preferred language.

#### Acceptance Criteria

1. WHEN an administrator creates a new Content_Item, THE Admin_Portal SHALL display side-by-side editing panels for Arabic and English content, with the Arabic panel positioned on the right and the English panel positioned on the left
2. THE Admin_Portal SHALL require that both Arabic and English title fields contain at least 2 non-whitespace characters and no more than 200 characters before allowing a Content_Item to be saved
3. WHEN an administrator saves a Content_Item, THE Content_API SHALL store both Arabic and English versions in the database as a single atomic operation
4. THE Rich_Text_Editor SHALL support right-to-left text direction for the Arabic editing panel and left-to-right text direction for the English editing panel
5. IF a database error occurs during save, THEN THE Content_API SHALL return an error message indicating the failure reason and THE Admin_Portal SHALL retain all entered content in the editing form fields without requiring the administrator to re-enter data
6. IF an administrator attempts to save a Content_Item with missing or invalid required fields, THEN THE Admin_Portal SHALL display a validation error message adjacent to each invalid field and SHALL NOT submit the Content_Item to the Content_API
7. THE Admin_Portal SHALL require that body content is provided in both Arabic and English, with each body field containing at least 1 character of non-whitespace text, before allowing a Content_Item to be saved

### Requirement 5: Service Content Management

**User Story:** As an administrator, I want to manage service page content, so that the advisory services displayed on the public website are accurate and up to date.

#### Acceptance Criteria

1. WHEN an administrator creates a new service Content_Item, THE Admin_Portal SHALL present fields for: title (Arabic and English, maximum 100 characters each), description (Arabic and English, maximum 500 characters each), icon selection from a predefined set of available icons, display order (positive integer starting from 1), and published status (published or unpublished)
2. WHEN an administrator changes the display order of a service, THE Content_API SHALL update the ordering and the Public_Website SHALL reflect the change on the next page load
3. WHEN an administrator sets a service Content_Item status to unpublished, THE Public_Website SHALL exclude that service from display on the next page load
4. THE Content_API SHALL return services to the Public_Website sorted by the administrator-defined display order in ascending numeric order, using creation date (oldest first) as a tiebreaker when two services share the same display order value
5. IF a save operation fails when an administrator creates or edits a service Content_Item, THEN THE Content_API SHALL return an error message indicating the failure reason and THE Admin_Portal SHALL preserve the unsaved content in the editing form

### Requirement 6: Knowledge Center Article Management

**User Story:** As an administrator, I want to publish and manage knowledge center articles, so that the company can share expertise and regulatory updates with visitors.

#### Acceptance Criteria

1. WHEN an administrator creates a new article, THE Admin_Portal SHALL present fields for: title (Arabic and English, maximum 200 characters each), body content (Arabic and English), category selection from the administrator-defined category list, featured image (optional), published status, and publish date
2. THE Rich_Text_Editor SHALL support heading levels 2 through 4, bold, italic, bullet lists, numbered lists, links, and embedded images within article body content
3. WHEN an administrator saves an article without specifying a publish date, THE Content_API SHALL use the current date and time as the publish date
4. WHEN an administrator sets a publish date in the future, THE Public_Website SHALL not display the article until the system clock has passed the specified publish date
5. WHEN an administrator sets an article status to unpublished, THE Public_Website SHALL exclude that article from display regardless of its publish date
6. WHEN an administrator assigns a category to an article, THE Public_Website SHALL include the article in the corresponding category filter on the knowledge center page
7. THE Content_API SHALL return published articles to the Public_Website sorted by publish date in descending order, returning a maximum of 20 articles per request
8. IF an administrator attempts to save an article without providing both Arabic and English titles, THEN THE Admin_Portal SHALL display a validation error and prevent the save operation

### Requirement 7: Page Section Content Management

**User Story:** As an administrator, I want to edit static page sections (homepage hero, about page, statistics, etc.), so that I can update messaging without developer involvement.

#### Acceptance Criteria

1. THE Admin_Portal SHALL display a list of editable page sections grouped by page (Homepage, About, Contact), showing each section's name and last-modified date
2. WHEN an administrator edits a page section, THE Admin_Portal SHALL present the existing content pre-filled in the editing form with side-by-side panels for Arabic and English, including the section-specific fields (e.g., title, subtitle, body text, statistic values, call-to-action label and link)
3. WHEN an administrator saves page section changes, THE Content_API SHALL validate that all required text fields contain between 1 and 2000 characters, update the content as a single atomic operation, and the Public_Website SHALL reflect the changes on the next page load
4. WHEN an administrator requests a preview of edited page section content, THE Admin_Portal SHALL render the section as it will appear on the Public_Website for both Arabic and English versions before the administrator confirms the save
5. IF a save operation fails due to a validation or database error, THEN THE Content_API SHALL return an error message indicating the failure reason and THE Admin_Portal SHALL preserve the unsaved content in the editing form
6. THE Admin_Portal SHALL present page sections as a fixed set defined during system setup, and SHALL NOT allow administrators to create new sections or delete existing sections

### Requirement 8: Media Upload and Management

**User Story:** As an administrator, I want to upload and manage images used in content, so that I can include visual elements in articles and page sections.

#### Acceptance Criteria

1. WHEN an administrator uploads an image, THE Media_Manager SHALL accept files in JPEG, PNG, and WebP formats with a maximum size of 5 megabytes
2. IF an administrator attempts to upload a file that is not in JPEG, PNG, or WebP format or exceeds 5 megabytes, THEN THE Media_Manager SHALL reject the upload and display an error message indicating the reason for rejection
3. WHEN an administrator uploads a valid image, THE Media_Manager SHALL store the file on the server file system and record the file path, original file name, file size, image dimensions, upload date, and uploading administrator in the database
4. WHEN an administrator opens the Media_Manager gallery, THE Media_Manager SHALL display uploaded images as thumbnail previews sorted by upload date in descending order, paginated in groups of 20 items per page
5. WHEN an administrator deletes an image that is not referenced by any Content_Item, THE Media_Manager SHALL remove the file from storage and delete the database record
6. IF an administrator attempts to delete an image that is referenced by a Content_Item, THEN THE Media_Manager SHALL display a warning listing the referencing Content_Items and require confirmation before deletion
7. WHEN an administrator confirms deletion of a referenced image, THE Media_Manager SHALL remove the file from storage, delete the database record, and clear the image reference from all associated Content_Items

### Requirement 9: Public Website Content Delivery

**User Story:** As a website visitor, I want to view content in my preferred language, so that I can understand the advisory services offered.

#### Acceptance Criteria

1. WHEN a visitor selects Arabic as the display language, THE Public_Website SHALL render all managed content using the Arabic version from the database and SHALL persist the language preference for the duration of the browser session so that subsequent page navigations retain the selected language
2. WHEN a visitor selects English as the display language, THE Public_Website SHALL render all managed content using the English version from the database and SHALL persist the language preference for the duration of the browser session so that subsequent page navigations retain the selected language
3. THE Public_Website SHALL default to Arabic language display when no language preference has been selected
4. WHEN the Content_API receives a request for published content, THE Content_API SHALL return only Content_Items with published status set to true and with a publish date equal to or earlier than the current server date
5. THE Content_API SHALL serve content responses within 500 milliseconds when handling up to 50 concurrent requests
6. IF the Content_API returns a Content_Item that has an empty or missing translation for the visitor's selected language, THEN THE Public_Website SHALL display the available alternative language version for that Content_Item
7. THE Public_Website SHALL display a language toggle control visible on every page that allows the visitor to switch between Arabic and English

### Requirement 10: Content Revision History

**User Story:** As an administrator, I want to see the history of changes to content, so that I can review what was changed and revert if needed.

#### Acceptance Criteria

1. WHEN an administrator saves changes to a Content_Item, THE Content_API SHALL create a revision record storing the complete previous content state (all fields in both Arabic and English), the timestamp of the change, and the identifier of the administrator who made the change, retaining a maximum of 50 revisions per Content_Item and discarding the oldest revision when the limit is exceeded
2. WHEN an administrator views a Content_Item revision history, THE Admin_Portal SHALL display a paginated chronological list (20 revisions per page, newest first) showing the date, author name, and a list of field names that were modified in each revision
3. WHEN an administrator selects a previous revision for restoration, THE Admin_Portal SHALL display the full content of that revision for review and require explicit confirmation before applying the restore
4. WHEN an administrator confirms restoration of a previous revision, THE Content_API SHALL replace the current Content_Item state with the selected revision content and create a new revision record capturing the pre-restoration state, so that the restore action itself is reversible
5. IF a restore operation fails due to a database error, THEN THE Content_API SHALL return an error message indicating the restore could not be completed and SHALL preserve the current Content_Item state unchanged
