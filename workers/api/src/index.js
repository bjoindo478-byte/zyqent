export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        message: "ZYQENT API ONLINE",
        database: "CONNECTED"
      });
    }

    if (url.pathname === "/api/database") {
      try {
        const result = await env.DB.prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
        ).all();

        return Response.json({
          success: true,
          tables: result.results
        });
      } catch (error) {
        return Response.json({
          success: false,
          message: "Database connection failed"
        }, { status: 500 });
      }
    }

    return Response.json({
      success: false,
      message: "ZYQENT API endpoint not found"
    }, { status: 404 });
  }
};
