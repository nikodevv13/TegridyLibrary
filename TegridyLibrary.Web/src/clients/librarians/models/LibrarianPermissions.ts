
const LibrarianPermissions = {
    ManageLibrarians: 0,
    ManageReaders: 100,
    ManageBooks: 200,
    ManageBookLoans: 300,
}

export default LibrarianPermissions;

export function getLibrarianPermissionLabel(permission: number) {
    if (permission === LibrarianPermissions.ManageLibrarians) {
        return 'Manage Librarians';
    } else if (permission === LibrarianPermissions.ManageReaders) {
        return 'Manage Readers';
    } else if (permission === LibrarianPermissions.ManageBooks) {
        return 'Manage Books';
    } else if (permission === LibrarianPermissions.ManageBookLoans) {
        return 'Manage BookLoans';
    } else {
        return 'Unknown';
    }
}