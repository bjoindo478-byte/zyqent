# ZYQENT — Cloudflare Project Package

This package contains a working visual starter for the ZYQENT ecosystem:
- `apps/member`: public Member website
- `apps/admin`: separate private Admin website
- `workers/api`: Cloudflare Worker API foundation
- `database/schema.sql`: starter D1 database schema
- deployment and security guides

## Important status
This is a **starter package**, not a completed production platform. The Member/Admin pages are visual foundations. Authentication endpoints deliberately return `501 Not Implemented`; do not accept public registrations or use the Admin login until secure server-side authentication, session handling, role checks, and recovery flows are implemented and tested. Google OAuth and live ZYQO AI also require provider credentials and integration work.
