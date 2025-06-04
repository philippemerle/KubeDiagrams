#! /bin/sh

BIN=../../bin

helm2diagram()
{
  echo "helm template $1 oci://registry-1.docker.io/gradiant/$1 --version $2 | $BIN/kube-diagrams - --without-namespace -o diagrams/gradiant-$1.png"
  helm template $1 oci://registry-1.docker.io/gradiant/$1 --version $2 | $BIN/kube-diagrams - --without-namespace -o diagrams/gradiant-$1.png
}

# Generate the Kubernetes architecture diagram for each Gradiant 5G Helm Chart.

# Based on Free5gc implementation
for chart in \
  free5gc-amf \
  free5gc-ausf \
  free5gc-chf \
  free5gc-nrf \
  free5gc-nssf \
  free5gc-pcf \
  free5gc-smf \
  free5gc-udm \
  free5gc-udr \
  free5gc-upf \
  free5gc-webui \
  free5gc
do
  helm2diagram $chart 0.1.2
done

# Based on Open5gs implementation
for chart in \
  open5gs-amf \
  open5gs-ausf \
  open5gs-bsf \
  open5gs-hss \
  open5gs-mme \
  open5gs-nrf \
  open5gs-nssf \
  open5gs-pcf \
  open5gs-pcrf \
  open5gs-scp \
  open5gs-sgwc \
  open5gs-sgwu \
  open5gs-smf \
  open5gs-udm \
  open5gs-udr \
  open5gs-upf \
  open5gs-webui \
  open5gs
do
  helm2diagram $chart 2.2.0
done

helm2diagram iperf3 0.1.3
helm2diagram jitsi 0.0.5
helm2diagram oai-enb 0.1.1
helm2diagram oai-gnb 0.3.2
helm2diagram packetrusher 0.0.2
helm2diagram srs-epc 0.2.1
helm2diagram srs-ue 0.2.0
helm2diagram srsran-4g-zmq 0.2.0
helm2diagram srsran-4g-enb 0.2.0
helm2diagram srsran-5g-zmq 1.0.1
helm2diagram srsran-5g 1.0.0
helm2diagram ueransim-gnb 0.2.6
helm2diagram ueransim-ues 0.1.2
