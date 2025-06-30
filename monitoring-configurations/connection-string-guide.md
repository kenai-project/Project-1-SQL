# Connection String Setup Guide

## PostgreSQL Connection String

Set the environment variable `PG_CONNECTION_STRING` with the following format:

```
postgresql://<username>:<password>@<host>:<port>/<database>
```

Example:

```
postgresql://myuser:mypassword@localhost:5432/mydatabase
```

Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database>` with your actual PostgreSQL credentials and connection details.

---

## MongoDB Atlas Connection String

Set the environment variable `MONGODB_URI` with the following format:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Example:

```
mongodb+srv://myuser:mypassword@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
```

Make sure your current IP address is whitelisted in the MongoDB Atlas Network Access settings.

---

## Next Steps

1. Update your `.env` file or environment variables with the above connection strings.
2. Restart your backend server to apply the changes.
3. Verify the connections and monitor logs for any errors.

If you need help with updating environment variables or whitelisting IPs, please ask.
