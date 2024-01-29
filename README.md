# ST4SD Registry UI

The ST4SD Registry UI is a web interface for the ST4SD Runtime Service, written
in Vue 3.

## Quick links

- [Getting started](#getting-started)
- [Development](#development)
- [Help and Support](#help-and-support)
- [Contributing](#contributing)
- [License](#license)

## Getting started

### Requirements

#### Node.js

Running and developing this website requires an up-to-date Node.js version. You
can check what Node.js version you have currently installed with

```bash
node -v
```

Please refer to the [Node.js download page](https://nodejs.org/en/download/) if
you don't have it installed or if your installed version is older than 20.

## Development

### Accessing the backend

The project requires access to a
[backend service](https://github.com/st4sd/st4sd-registry-backend) to work. The
[development configuration provided](vite.config.js) intercepts the calls to the
backend and forwards them to `0.0.0.0:8085`.

#### Spinning up a development version of the st4sd-registry-backend

To use a local development version of the `st4sd-registry-backend` please follow
the instructions provided at:
https://github.com/st4sd/st4sd-registry-backend#developing-locally.

#### Port-forwarding the backend from an OpenShift deployment

Another option is to port-forward the backend from the OpenShift project where
we deployed ST4SD. To access it, **after ensuring we are logged in to the
OpenShift cluster**, we can run the following command:

```shell
kubectl port-forward svc/st4sd-registry-backend 8085:8085 -n $DEPLOYMENT_NAMESPACE
```

Where `$DEPLOYMENT_NAMESPACE` is the namespace where you deployed ST4SD. You can
omit it if you're forwarding the service from the active namespace (you can
check what the active namespace is with `oc project`).

### Installing dependencies

Install the dependencies for this project with:

```bash
yarn install
```

### Build a development version of this project with hot reloading

This command will build a development version of the website (without
optimizations) and start a server where you can preview the changes you've made,
with hot reloading capabilities.

```bash
yarn serve
```

### Build for production

This command will create a production-ready build of the website. It will apply
optimizations such as minifying the output files.

```bash
yarn build
```

## Help and Support

Please feel free to reach out to one of the maintainers listed in the
[MAINTAINERS.md](MAINTAINERS.md) page.

## Contributing

We always welcome external contributions. Please see our
[guidance](CONTRIBUTING.md) for details on how to do so.

## References

If you use ST4SD in your projects, please consider citing the following:

```bibtex
@software{st4sd_2022,
author = {Johnston, Michael A. and Vassiliadis, Vassilis and Pomponio, Alessandro and Pyzer-Knapp, Edward},
license = {Apache-2.0},
month = {12},
title = {{Simulation Toolkit for Scientific Discovery}},
url = {https://github.com/st4sd/st4sd-runtime-core},
year = {2022}
}
```

## License

This project is licensed under the Apache 2.0 license. Please
[see details here](LICENSE.md).
