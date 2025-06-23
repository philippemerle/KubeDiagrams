#! /bin/sh

BIN=../../bin

# Download DeathStarBench GH repository
git clone https://github.com/delimitrou/DeathStarBench.git downloads/DeathStarBench

#
# DeathStarBench Hotel Reservation application
#

HotelReservation=downloads/DeathStarBench/hotelReservation

# Generate diagrams from DeathStarBench Hotel Reservation Helm Chart
$BIN/helm-diagrams $HotelReservation/helm-chart/hotelreservation -c configs/disable_service_cluster.kd -o diagrams/hotelreservation-helm-chart.png

# Generate diagrams from DeathStarBench Hotel Reservation KNative manifests
$BIN/kube-diagrams $HotelReservation/knative/*.yaml $HotelReservation/knative/svc/*.yaml -c configs/knative.kd -o diagrams/hotelreservation-knative.png
$BIN/kube-diagrams $HotelReservation/knative/*.yaml $HotelReservation/knative/svc/*.yaml -c configs/hotelreservation-knative.kd -o diagrams/hotelreservation-knative-custom-diagram.png

# Generate diagrams from DeathStarBench Hotel Reservation Kubernetes manifests
$BIN/kube-diagrams $HotelReservation/kubernetes/*/*.yaml -o diagrams/hotelreservation-kubernetes.png
$BIN/kube-diagrams $HotelReservation/kubernetes/*/*.yaml -c configs/hotelreservation-kubernetes.kd -o diagrams/hotelreservation-kubernetes-custom-diagram.png

# Generate diagrams from DeathStarBench Hotel Reservation OpenShift manifests
$BIN/kube-diagrams $HotelReservation/openshift/*.yaml -c configs/openshift.kd -o diagrams/hotelreservation-openshift.png
$BIN/kube-diagrams $HotelReservation/openshift/*.yaml -c configs/openshift.kd -c configs/hotelreservation-openshift.kd -o diagrams/hotelreservation-openshift-custom-diagram.png

#
# DeathStarBench Media Microservices application
#

MediaMicroservices=downloads/DeathStarBench/mediaMicroservices

# Generate diagrams from DeathStarBench Media Microservices Helm Chart
$BIN/helm-diagrams $MediaMicroservices/helm-chart/mediamicroservices -c configs/disable_service_cluster.kd -o diagrams/mediamicroservices-helm-chart.png

# Generate diagrams from DeathStarBench Media Microservices OpenShift manifests
$BIN/kube-diagrams $MediaMicroservices/openshift/*.yaml -c configs/openshift.kd -o diagrams/mediamicroservices-openshift.png

#
# DeathStarBench Social Network application
#

SocialNetwork=downloads/DeathStarBench/socialNetwork

# Generate diagrams from DeathStarBench Social Network Helm Chart
$BIN/helm-diagrams $SocialNetwork/helm-chart/socialnetwork -c configs/disable_service_cluster.kd -o diagrams/socialnetwork-helm-chart.png

# Generate diagrams from DeathStarBench Social Network OpenShift manifests
$BIN/kube-diagrams $SocialNetwork/openshift/*.yaml -o diagrams/socialnetwork-openshift.png
