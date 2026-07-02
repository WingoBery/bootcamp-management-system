# Kubernetes manifests for the Bootcamp Management System
#
# Before applying:
# 1. Build and load/push images for gateway, user-service, bootcamp-service,
#    registration-service, showcase-service, and frontend.
# 2. Update secrets.yaml with production values (never commit real secrets).
# 3. Update configmap.yaml database URLs and domain settings.
# 4. Update ingress.yaml host and TLS secret.
#
# Apply order:
#   kubectl apply -f namespace.yaml
#   kubectl apply -f configmap.yaml
#   kubectl apply -f secrets.yaml
#   kubectl apply -f postgres-init-configmap.yaml
#   kubectl apply -f postgres-pvc.yaml
#   kubectl apply -f postgres-deployment.yaml
#   kubectl apply -f user-service.yaml
#   kubectl apply -f bootcamp-service.yaml
#   kubectl apply -f registration-service.yaml
#   kubectl apply -f showcase-service.yaml
#   kubectl apply -f gateway.yaml
#   kubectl apply -f frontend.yaml
#   kubectl apply -f ingress.yaml
#
# Or apply all at once:
#   kubectl apply -f k8s/
