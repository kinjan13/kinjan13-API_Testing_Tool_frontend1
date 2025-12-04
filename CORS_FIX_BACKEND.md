# Backend CORS Fix Required

## Problem
The backend at `https://api-testing-tool-backend-tzdy.onrender.com` is configured to only allow requests from `https://kinjan13-api-testing-tool-frontend1.vercel.app/`, but the frontend dev server is running on `http://localhost:3000`.

The error message from the browser console:
```
The 'Access-Control-Allow-Origin' header has a value 'https://kinjan13-api-testing-tool-frontend1.vercel.app/' 
that is not equal to the supplied origin 'http://localhost:3000'
```

## Solution: Update Backend CORS Configuration

### If using Node.js/Express:
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'https://kinjan13-api-testing-tool-frontend1.vercel.app',
  // Add any other frontend URLs here
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### If using Python/Flask:
```python
from flask_cors import CORS

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5000",
            "https://kinjan13-api-testing-tool-frontend1.vercel.app",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})
```

### If using Python/FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5000",
        "https://kinjan13-api-testing-tool-frontend1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### If using Java/Spring Boot:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://localhost:5000",
                        "https://kinjan13-api-testing-tool-frontend1.vercel.app"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## After Making Backend Changes
1. Deploy the updated backend to Render.
2. Restart the backend service.
3. Try login on the frontend again—it should now work.

## Temporary Local Testing Alternative
If you want to test locally without fixing the backend:
1. Deploy the frontend to Vercel (it's already configured in your repo).
2. Test against the production frontend URL—it should work since the backend allows it.
3. Or temporarily configure the backend to allow `*` (all origins) for testing only, then revert.
