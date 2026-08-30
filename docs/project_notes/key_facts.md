# Key Facts

## The Danger Zone

**Never store these in [key_facts.md](/docs/project_notes/key_facts.md) (or any memory file):

| Category | Examples | Why it's dangerous |
| --- | --- | --- |
| Authentication | Passwords, API Keys, tokens, Secrets | Direct Credential theft |
| Service Accounts | GCP, AWS, Cloudflare key files, privage keys | Full Service Impersonation |
| OAuth | Client secrets, refresh tokens | Account takeouver |
| Database | Connection Strings with passwords | Data breach |
| Infrastructure | SSH Private Keys, VPN Credentials | Network Intrusion |

## The Safe Zone

| Category | Examples | Why it's safe |
| --- | --- | --- |
| Hostnames | api.staging.example.com | Public DNS, no auth value |
| Ports | Postgresql:5432, Redis:6379 | Standard Ports, no access |
| Project Ids | gcp-project-id: my-app-prod | Useless without access or credentials |
| Email Addresses | `service-account@project.com` | Identity, not authentictaion |
| Public Endpoints | `https://api.example.com` | publicly discoverable |
| Environment Names | staging, dev, production | No Security Value |

## Where Secrets Belong

| Storage Method | Best For | Example |
| --- | --- | --- |
| .env files (gitignored) | Local Development | DATABASE_PASSWORD=superSecret12# |
| Cloud secrets managers | Production Systems | Cloudflare Secrets |
| CI/CD Variables | Automated Pipelines | Github Actions secrets |
| Password managers | personal credentials | 1Password, LastPass, NordPass, etc |
