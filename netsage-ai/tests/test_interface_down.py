from engine.rules.checker import check_interface_down


def test_interface_up():
    result = check_interface_down(
        "Gi0/0",
        "up",
        "up",
    )

    assert result["status"] == "PASS"


def test_interface_administratively_down():
    result = check_interface_down(
        "Gi0/0",
        "administratively down",
        "down",
    )

    assert result["status"] == "FAIL"
    assert result["rule_id"] == "INTERFACE_DOWN"


def test_interface_down_down():
    result = check_interface_down(
        "Gi0/0",
        "down",
        "down",
    )

    assert result["status"] == "FAIL"


def test_missing_interface_state():
    result = check_interface_down(
        "Gi0/0",
        "",
        "up",
    )

    assert result["status"] == "UNKNOWN"


def test_unknown_interface_state():
    result = check_interface_down(
        "Gi0/0",
        "unknown",
        "unknown",
    )

    assert result["status"] == "UNKNOWN"