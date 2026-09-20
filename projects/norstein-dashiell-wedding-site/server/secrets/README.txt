Server Secrets

Credential files used by the Norstein-Dashiell Wedding Website are not committed to source control.

The React client must never receive server-side credentials.

Google API access uses Application Default Credentials (ADC). Local development should use the developer's authenticated Google user credentials through the Google Cloud CLI rather than a long-lived service-account private key.

For production on the self-hosted server, use Workload Identity Federation or another approved short-lived ADC mechanism. Do not create, commit, or deploy long-lived service-account key files merely to satisfy this application.

If a future protected credential configuration file is required, it may be stored in this ignored directory and referenced by GOOGLE_APPLICATION_CREDENTIALS.

Production credentials and the production workbook must remain separate from development/test credentials and data.

Production secrets and credentials must be transferred to the deployment environment separately from the Git repository.
