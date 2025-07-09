import { app } from "./app"

app.listen({ 
  host: '0.0.0.0',
  port: 5000 
})
.then(() => {
  console.log(`🌐  HTTP server is running: http://localhost:5000`)
}
)
