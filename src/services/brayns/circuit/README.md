# Brayns Service

There are two servers that should run on BB5 or in the cloud:

- **renderer**: A ray-tracer written in C++ that can load and display circuits.
- **backend**: A Python server to get hold of the session variables and to get information on circuits.

To be able to access them, we need to allocate resources on BB5 or the cloud.
Two servers are used for this:

- **Proxy master**: <https://vsm.kcp.bbp.epfl.ch/>
- **Proxy slave**: <https://vsm-proxy.kcp.bbp.epfl.ch/>

The first one is responsible of allocating a **job**.
It's secured with the token used in a header property: `Authorization: Bearer ${token}`.

It has a REST interface with two entry points:

1. POST /start
   - params: `{ usecase: string }`
     - `usecase` is used to select which version of renderer and backend to launch.
       Possible values are defined here: [script_list.py](https://bbpgitlab.epfl.ch/viz/brayns/vsm/-/blob/master/vsm/script_list.py)
       To edit launch scripts, create a MR for the `master` branch.
   - return: `{ job_id: string }`
     - `job_id` uniquely identifies the job you have allocated.
2. GET /status/${job_id}
   - params: none.
   - return: `{ job_running: boolean; end_time?: string; brayns_started: boolean }`
     - There are two steps in the process: first we wait for a node to be allocated (`job_running = true`)
       then we wait for the backend and the renderer to be up and running (`brayns_started = true`).
       Since an allocation doesn't last forever, `end_time` indicated the expiration timestamp in ISO format
       ("2023-06-02T10:39:49").

Once the job is up and running, you can use the proxy slave to access the renderer and the backend through WebSocket:

- wss://vsm-proxy.kcp.bbp.epfl.ch/\${job_id}/renderer?token=${token}
- wss://vsm-proxy.kcp.bbp.epfl.ch/\${job_id}/backend?token=${token}

## Troubleshooting

### How to get the logs of the proxy?

First get the pod's name of the server you are interested in:

```bash
kubectl get pods | grep sbo-vsm
```

The get the logs:

```bash
kubectl logs <POD_NAME>
```

For instance, if with the previous command you found out that the name was `sbo-vsm-6c8fc95587-55m7z`,
then you can get the logs like this: `kubectl logs sbo-vsm-6c8fc95587-55m7z`.
