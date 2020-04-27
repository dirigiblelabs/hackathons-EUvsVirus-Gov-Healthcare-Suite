Docker build "Gov Healthcare Suite"
```
docker build -t samples-gov-healthcare-suite -f Dockerfile-suite .
docker tag samples-gov-healthcare-suite dirigiblelabs/samples-gov-healthcare-suite
docker push dirigiblelabs/samples-gov-healthcare-suite
```

Docker build "Gov Healthcare - Public Site"
```
docker build -t samples-gov-healthcare-public-site -f Dockerfile-public-site .
docker tag samples-gov-healthcare-public-site dirigiblelabs/samples-gov-healthcare-public-site
docker push dirigiblelabs/samples-gov-healthcare-public-site
```

Kubernetes Deployment:
```
kubectl apply -f deployment.yaml 
```
> **Note:** Replace {{your-host}} in **deployment.yaml** before executing the command