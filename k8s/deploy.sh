#!/bin/bash

aws eks update-kubeconfig --region us-east-1 --name devopssteps-eks-1

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
