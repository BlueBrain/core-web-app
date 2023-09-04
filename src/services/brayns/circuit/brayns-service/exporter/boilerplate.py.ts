/**
 * This Python code will be used to generate the export
 * script with the recorded queries.
 * This way we can reproduce a scenario with Brayns but
 * outside of SBO code.
 */
const BoilerPlateCode = `
import sys
import json
import brayns

def info(*message: str):
    print(*message, flush=True)

def fatal(*message):
    info("#" * 60)
    info(*message)
    info("#" * 60)
    sys.exit(1)

def box(text: str):
    info(f"+{'-' * (len(text) + 2)}+")
    info(f"| {text} |")
    info(f"+{'-' * (len(text) + 2)}+")

def usage():
    print()
    print("Usage: python {} <hostname>".format(sys.argv[0]))
    print()
    print("Dependencies: brayns, json.")
    print()
    sys.exit(1)

def process(queries):
    if len(sys.argv) < 2:
        usage()
    hostname = sys.argv[1]
    box(f"Connecting Brayns on {hostname}...")
    connector = brayns.Connector(sys.argv[1])
    with connector.connect() as instance:
        for method, params in queries:
            print(">>>", method)
            task = instance.task(method, params)
            for progress in task:
                print(progress)
            task.wait_for_reply()
    box("All queries executed!")

`;

export default BoilerPlateCode;
