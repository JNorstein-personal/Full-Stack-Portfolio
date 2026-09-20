Server Secrets

Credential files used by the Norstein-Dashiell Wedding Website are not committed to source control.

The React client must never receive server-side credentials.

Environment configuration may reference protected credential files stored in this directory when required.

For development Google Sheets access, a development-only Google service-account credential file may be stored here and referenced by GOOGLE_SERVICE_ACCOUNT_FILE. The associated development workbook must be separate from production data and shared only with the intended development service account and authorized administrators.

Production credentials and the production workbook must remain separate from development/test credentials and data.

Production secrets and credentials must be transferred to the deployment environment separately from the Git repository.
