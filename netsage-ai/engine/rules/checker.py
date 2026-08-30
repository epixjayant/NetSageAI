import ipaddress


def check_gateway_mismatch(
    ip_address: str,
    subnet_mask: str,
    gateway: str,
) -> dict:
    """
    Determine whether a host's default gateway belongs
    to the same subnet as the host.
    """

    base_result = {
        "rule_id": "GATEWAY_MISMATCH",
        "severity": "high",
    }

    # Missing evidence means we cannot evaluate the rule.
    if not ip_address or not subnet_mask or not gateway:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Insufficient information to evaluate gateway membership.",
            "evidence": {
                "ip": ip_address,
                "subnet_mask": subnet_mask,
                "gateway": gateway,
            },
        }

    try:
        network = ipaddress.ip_network(
            f"{ip_address}/{subnet_mask}",
            strict=False,
        )
        gateway_ip = ipaddress.ip_address(gateway)

    except ValueError:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Invalid IP address, subnet mask, or gateway.",
            "evidence": {
                "ip": ip_address,
                "subnet_mask": subnet_mask,
                "gateway": gateway,
            },
        }

    if gateway_ip not in network:
        return {
            **base_result,
            "status": "FAIL",
            "message": "Default gateway is outside the host subnet.",
            "evidence": {
                "ip": ip_address,
                "subnet_mask": subnet_mask,
                "gateway": gateway,
                "host_subnet": str(network),
            },
        }

    return {
        **base_result,
        "status": "PASS",
        "severity": "none",
        "message": "Default gateway belongs to the host subnet.",
        "evidence": {
            "ip": ip_address,
            "subnet_mask": subnet_mask,
            "gateway": gateway,
            "host_subnet": str(network),
        },
    }


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
        actual_network = ipaddress.ip_network(
            f"{ip_address}/{actual_mask}",
            strict=False,
        )

        expected_network = ipaddress.ip_network(
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