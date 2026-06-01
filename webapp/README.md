## Project Structure
Web Interface for generating Kubernetes diagrams from manifests, Helm charts, or Helmfile files using Kubediagrams.
# KubeDiagrams Web App

A modern web application for generating Kubernetes architecture diagrams from manifests, Helm charts, or Helmfile configurations using [KubeDiagrams](https://github.com/philippemerle/KubeDiagrams).

## Features

- **Multiple Input Types**: Support for Kubernetes manifests, Helm charts, Helmfile configurations, and live cluster diagrams
- **Flexible Output Formats**: Generate diagrams in PNG, SVG, PDF, DOT, and interactive HTML
- **Interactive Viewer**: Explore diagrams with an interactive web viewer
- **Built-in Examples**: Pre-loaded examples for quick testing
- **History Management**: Keep track of your diagram generations
- **Docker Support**: Easy deployment with Docker and Docker Compose
- **Access Logging**: Apache Combined Log format compatible with GoAccess

---

## Quick Start

### Using Docker Compose (Recommended)

#### 1. **Clone the repository**

```bash
git clone https://github.com/philippemerle/KubeDiagrams.git
cd KubeDiagrams/webapp
```

#### 2. **Start the application**

```bash
docker-compose up -d 
```

#### 3. **Access the application**

Open your browser and navigate to `http://localhost:8080`.

That's it! The application is now running with both frontend and backend services.

#### Stopping the application

```bash
docker-compose down
```

---

## Prerequisites

### Server-Side Tools (Required) (Include in requirements.txt)

The following command-line tools must be installed and available in your PATH:

- **`kube-diagrams/helm-diagrams`** - For generating diagrams from Kubernetes manifests and for generating diagrams from Helm charts ([Installation](https://github.com/philippemerle/KubeDiagrams))
- **`helmfile`** - Required only for Helmfile tab functionality ([Installation](https://github.com/helmfile/helmfile))

### Docker Deployment
- Docker Engine 20.10+
- Docker Compose 

### Manual Deployment
- **Backend**: Python 3.8+, pip, venv
- **Frontend**: Node.js 18+, npm

---

## Project Structure

```
webapp/
├── backend/                        # Python/Flask backend
│   ├── routes/                     # Flask route handlers
│   │   ├── manifest.py             # Manifest diagram generation endpoints
│   │   ├── helm.py                 # Helm chart diagram endpoints
│   │   ├── helmfile.py             # Helmfile diagram endpoints
│   │   ├── cluster.py              # Cluster diagram endpoints
│   │   └── submit.py               # Feedback submission endpoint
│   ├── services/                   # Business logic layer
│   │   ├── manifestService.py      # Manifest processing service
│   │   ├── helmService.py          # Helm processing service
│   │   ├── helmfileService.py      # Helmfile processing service
│   │   ├── clusterService.py       # Cluster processing service
│   │   ├── file_manager.py         # File operations manager
│   │   └── models.py               # Data models
│   ├── utils/                      # Utility modules
│   │   ├── access_logger.py        # Request logging
│   │   ├── logger.py               # General logging
│   │   ├── response_builder.py     # API response builder
│   │   └── validators.py           # Input validation
│   ├── app.py                      # Flask application entry point
│   ├── config.py                   # Configuration settings
│   ├── constants.py                # Global constants
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend Docker image
│   └── logs/                       # Log files (auto-rotation)
│
├── frontend/                       # React/Vite frontend
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── common/             # Reusable UI components
│   │   │   ├── options/            # Diagram configuration components
│   │   │   └── tabs/               # Main tab components
│   │   │       ├── ManifestTab/    # Kubernetes manifest tab
│   │   │       ├── HelmTab/        # Helm chart tab
│   │   │       ├── HelmFileTab/    # Helmfile tab
│   │   │       ├── ClusterTab/     # Live cluster tab
│   │   │       └── InteractiveViewerTab/  # Interactive viewer
│   │   ├── examples/               # Example registry
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API client services
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # Application entry point
│   ├── public/
│   │   ├── examples/               # Example YAML files
│   │   │   ├── manifests/          # Manifest examples
│   │   │   └── helmfiles/          # Helmfile examples
│   │   └── interactive_viewer/     # Interactive viewer assets
│   ├── package.json                # NPM dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── apache.conf                 # Apache reverse proxy config
│   └── Dockerfile                  # Frontend Docker image
│
└── docker-compose.yml              # Docker Compose orchestration
```

---

## Manual Installation (Without Docker)

### Backend Setup

#### 1. **Navigate to backend directory**

```bash
cd backend
```

#### 2. **Create and activate virtual environment**

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 3. **Install dependencies**

```bash
pip install -r requirements.txt
```

#### 4. **Start the Flask server**

```bash
python3 app.py
```

The backend server will be available at `http://localhost:5000`.

### Frontend Setup

#### 1. **Navigate to frontend directory**

```bash
cd frontend
```

#### 2. **Install dependencies**

```bash
npm install
```

or

```bash
npm ci
```

#### 3. **Start the development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Docker Deployment

### Architecture

The Docker Compose setup consists of two services:
- **Frontend**: Apache2 server serving React static files and acting as reverse proxy to the backend
- **Backend**: Python/Flask application with Gunicorn WSGI server running KubeDiagrams

### Configuration

#### Environment Variables

**Backend** (`backend/Dockerfile` or `docker-compose.yml`):
- `FLASK_ENV`: Set to `production` for production deployment
- `BEHIND_PROXY`: Set to `true` when running behind a reverse proxy (default: `true`)
- `PROXY_X_FOR`: Number of trusted proxies (default: `1`)

**Frontend** (`docker-compose.yml`):
- `BACKEND_URL`: Backend service URL (default: `http://backend:5000`)

#### Ports

- **Frontend**: Port `8080` (mapped to container port `80`)
- **Backend**: Port `5000` (internal only, accessed via frontend proxy)

### Building and Running

#### **Build and start services**

```bash
docker-compose up --build
```

#### **Start in detached mode**

```bash
docker-compose up -d
```

#### **View logs**

```bash
docker-compose logs -f
```

#### **Stop services**

```bash
docker-compose down
```

### Health Checks

The backend includes a health check endpoint at `/api/health` that Docker uses to monitor service health.

---

## Logging

The Flask backend generates detailed access logs in **Apache Combined Log format**, compatible with tools like **GoAccess** for analysis.

### Log Location

- **Docker**: `./backend/logs/access.log` (persisted via volume mount)
- **Manual**: `backend/logs/access.log`

### Log Format

```
IP - - [datetime] "METHOD PATH PROTOCOL" STATUS SIZE "REFERER" "USER-AGENT" TIME_MS
```

### Log Rotation

- **Frequency**: Daily at midnight
- **Retention**: 30 days
- **Format**: `access.log.YYYY-MM-DD`

### IP Address Detection

When running behind a reverse proxy (Apache, Nginx), the backend correctly identifies client IPs using `X-Forwarded-For` headers.

**Debug endpoint**: `GET /api/debug/ip` - Returns IP detection information

---

##  Usage Guide

### 1. Kubernetes Manifest Tab

Generate diagrams from raw Kubernetes YAML manifests.

**Steps**:
1. Select the "Manifest" tab
2. Paste your Kubernetes YAML or load an example
3. Configure diagram options (format, orientation, colors, etc.)
4. Click "Generate Diagram"
5. Download the generated diagram or view it interactively

**Supported Resources**: Deployments, StatefulSets, Services, Ingresses, ConfigMaps, Secrets, PVCs, and more.

### 2. Helm Chart Tab

Generate diagrams from Helm chart URLs.

**Steps**:
1. Select the "Helm" tab
2. Enter the Helm chart URL (e.g., `https://charts.bitnami.com/bitnami/wordpress`)
3. Optionally provide a values file
4. Configure diagram options
5. Click "Generate Diagram"

**Note**: Supports both public Helm repositories and OCI registries.

### 3. Helmfile Tab

Generate diagrams from Helmfile configurations.

**Steps**:
1. Select the "Helmfile" tab
2. Paste your Helmfile YAML or load an example
3. Configure diagram options
4. Click "Generate Diagram"

**Requirement**: `helmfile` must be installed on the server.
5. 
### 4. Cluster Tab
Generate diagrams from a live Kubernetes cluster.
**Steps**:
1. Select the "Cluster" tab
2. Optionally specify a Kubernetes context (leave empty to use current context)
3. Optionally specify a namespace (leave empty to diagram all namespaces)
4. Configure diagram options
5. Click "Generate Cluster Diagram"
**Requirements**: 
- `kubectl-diagrams` must be installed on the server
- Server must have access to a Kubernetes cluster via kubeconfig
- Proper RBAC permissions to read cluster resources
**Note**: This uses the server's kubectl configuration, not the client's.
6. 
### 5. Interactive Viewer
View diagrams in an interactive HTML viewer with zoom, pan, and search capabilities.

**Features**:
-  Search nodes by name
-  Highlight nodes on hover
-  Pan and zoom controls
-  Responsive design

---

## ️ Configuration Options

### Diagram Options

- **Format**: PNG, SVG, PDF, DOT, Interactive HTML
- **CLI Arguments**: Optional custom parameters passed to the underlying KubeDiagrams tools
- **Without Namespace**: Option to generate diagrams without namespace grouping
- **Feedback System**: Rate diagrams (1-5 stars) and provide comments for improvement

### Available via CLI Arguments

The CLI arguments field allows you to pass additional parameters to customize diagram generation. Refer to [KubeDiagrams documentation](https://github.com/philippemerle/KubeDiagrams#usage) for available options.

---

##  Examples

The web application includes built-in examples for quick testing:

### Manifest Examples

- **Redis StatefulSet**: Redis cluster with persistent storage
- **Microservices**: Multi-service application with ingress
- **WordPress**: WordPress with MySQL database
- **Cassandra**: Cassandra StatefulSet with headless service

### Helm Chart Examples

Many Helm Chart URLs are provided.

### Helmfile Examples

- **Monitoring Stack**: Prometheus, Grafana, and AlertManager

### Adding Custom Examples

See `frontend/public/examples/README.md` for instructions on adding new examples.

---

##  API Endpoints

### Backend API

- `POST /api/manifest/generate` - Generate diagram from manifest
- `POST /api/helm/generate` - Generate diagram from Helm chart
- `POST /api/helmfile/generate` - Generate diagram from Helmfile
- `POST /api/cluster/generate` - Generate diagram from live cluster
- `POST /api/submit` - Submit feedback

---

## Troubleshooting

### Common Issues

**Issue**: "Command not found: kube-diagrams"
- **Solution**: Ensure KubeDiagrams is installed and in your PATH

**Issue**: Diagram generation fails with Helm charts
- **Solution**: Verify `helm-diagrams` is installed and the chart URL is accessible

**Issue**: Frontend cannot connect to backend
- **Solution**: Check that backend is running and CORS is properly configured

**Issue**: IP addresses showing as proxy IP instead of client IP
- **Solution**: Verify `BEHIND_PROXY=true` and `PROXY_X_FOR` is set correctly

### Debug Mode

Enable debug mode by setting `DEBUG=True` in `backend/config.py` for more detailed error messages.

---

## Testing

### Quick Test

1. Start both backend and frontend servers
2. Navigate to `http://localhost:8080` (Docker) or `http://localhost:5173` (manual)
3. Select the "Manifest" tab
4. Load an example (e.g., "Redis StatefulSet")
5. Click "Generate Diagram"
6. Verify the diagram is generated and can be downloaded

---
##  Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend Development

```bash
cd backend
source venv/bin/activate
python3 app.py       # Start Flask server in debug mode
```

### Technologies Used

**Backend**:
- Flask 3.1.3 - Web framework
- Gunicorn 26.0.0 - WSGI server
- KubeDiagrams (main) - Diagram generation
- PyYAML 6.0.3 - YAML parsing
- Werkzeug 3.1.6 - WSGI utilities

**Frontend**:
- React 19.1.0 - UI framework
- Vite 6.3.5 - Build tool
- TailwindCSS 4.1.6 - Styling
- Lucide React 0.552.0 - Icons
- Motion 12.11.4 - Animations
---

## Contributing

Contributions are welcome! Please feel free to [submit a Pull Request](https://github.com/philippemerle/KubeDiagrams/pulls).

---

## Support

For issues and questions, please [open an issue on the GitHub repository](https://github.com/philippemerle/KubeDiagrams/issues).

---

## Acknowledgments
- [Graphviz](https://graphviz.org/) - Graph visualization software
