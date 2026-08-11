from flask import Blueprint, request, jsonify
import subprocess
import tempfile
import os

code_bp = Blueprint("code", __name__)


@code_bp.route("/run", methods=["POST"])
def run_code():
    try:
        data = request.get_json()

        language = data.get("language")
        code = data.get("code")

        if language != "python":
            return jsonify({
                "output": "Currently local engine supports Python only"
            })

        if not code or code.strip() == "":
            return jsonify({
                "output": "Code is empty"
            })

        with tempfile.NamedTemporaryFile(
            suffix=".py",
            delete=False,
            mode="w",
            encoding="utf-8"
        ) as f:

            f.write(code)
            temp_file = f.name

        result = subprocess.run(
            ["python", temp_file],
            capture_output=True,
            text=True,
            timeout=5
        )

        os.remove(temp_file)

        output = (
            result.stdout
            or result.stderr
            or "No Output"
        )

        return jsonify({
            "output": output.strip()
        })

    except subprocess.TimeoutExpired:
        return jsonify({
            "output": "Execution Timeout (5 sec)"
        })

    except Exception as e:
        return jsonify({
            "output": str(e)
        })