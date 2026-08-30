from engine.rules.checker import check_gateway_mismatch


def test_gateway_inside_subnet():
    result = check_gateway_mismatch(
        "192.168.10.20",
        "255.255.255.0",
        "192.168.10.1",
    )

    assert result["status"] == "PASS"


def test_gateway_outside_subnet():
    result = check_gateway_mismatch(
        "192.168.10.20",
        "255.255.255.0",
        "192.168.20.1",
    )

    assert result["status"] == "FAIL"
    assert result["rule_id"] == "GATEWAY_MISMATCH"


def test_missing_gateway():
    result = check_gateway_mismatch(
        "192.168.10.20",
        "255.255.255.0",
        "",
    )

    assert result["status"] == "UNKNOWN"


def test_invalid_ip_information():
    result = check_gateway_mismatch(
        "not-an-ip",
        "255.255.255.0",
        "192.168.10.1",
    )

    assert result["status"] == "UNKNOWN"

def test_invalid_subnet_mask():
    result = check_gateway_mismatch(
        "192.168.10.20",
        "not-a-mask",
        "192.168.10.1",
    )

    assert result["status"] == "UNKNOWN"


def test_invalid_gateway():
    result = check_gateway_mismatch(
        "192.168.10.20",
        "255.255.255.0",
        "not-a-gateway",
    )

    assert result["status"] == "UNKNOWN"