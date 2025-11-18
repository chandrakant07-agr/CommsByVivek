import { baseApiSlice } from './baseApiSlice';

export const backupApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        downloadBackup: builder.mutation({
            query: () => ({
                url: '/admin/backup/download',
                method: 'GET',
                responseHandler: (response) => response.blob(),
                cache: 'no-cache',
            }),
            transformResponse: (response) => {
                const url = window.URL.createObjectURL(response);
                const link = document.createElement('a');
                link.href = url;

                const date = new Date();

                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

                const timeStr = `${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`;
                
                const filename = `commsbyvivek_backup_${dateStr}_${timeStr}.json`;

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();

                // Clean up the DOM and revoke the object URL to free up memory
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);

                return { success: true };
            },
        }),
    }),
});

export const { useDownloadBackupMutation } = backupApiSlice;
