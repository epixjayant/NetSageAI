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


def check_wrong_subnet_mask(
    ip_address: str,
    actual_mask: str,
    expected_mask: str,
) -> dict:
    """
    Determine whether the supplied subnet mask matches
    the expected subnet mask.
    """

    base_result = {
        "rule_id": "WRONG_SUBNET_MASK",
        "severity": "high",
    }

    if not ip_address or not actual_mask or not expected_mask:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Insufficient information to evaluate the subnet mask.",
            "evidence": {
                "ip": ip_address,
                "actual_mask": actual_mask,
                "expected_mask": expected_mask,
            },
        }

    try:
        actual_network = ip_address.ip_network(
            f"{ip_address}/{actual_mask}",
            strict=False,
        )

        expected_network = ip_address.ip_network(
            f"{ip_address}/{expected_mask}",
            strict=False,
        )

    except ValueError:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Invalid IP address or subnet mask.",
            "evidence": {
                "ip": ip_address,
                "actual_mask": actual_mask,
                "expected_mask": expected_mask,
            },
        }

    if actual_network.prefixlen != expected_network.prefixlen:
        return {
            **base_result,
            "status": "FAIL",
            "message": "Subnet mask does not match the expected network mask.",
            "evidence": {
                "ip": ip_address,
                "actual_mask": actual_mask,
                "expected_mask": expected_mask,
                "actual_prefix": actual_network.prefixlen,
                "expected_prefix": expected_network.prefixlen,
            },
        }

    return {
        **base_result,
        "status": "PASS",
        "severity": "none",
        "message": "Subnet mask matches the expected network mask.",
        "evidence": {
            "ip": ip_address,
            "actual_mask": actual_mask,
            "expected_mask": expected_mask,
            "prefix": actual_network.prefixlen,
        },
    }