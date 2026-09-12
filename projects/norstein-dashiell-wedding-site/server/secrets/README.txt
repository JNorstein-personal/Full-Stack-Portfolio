Server Secrets

Credential files used by the Norstein-Dashiell Wedding Website are not committed to source control.

The React client must never receive server-side credentials.

Environment configuration may reference protected credential files stored in this directory when required.

Production secrets and credentials must be transferred to the deployment environment separately from the Git repository.