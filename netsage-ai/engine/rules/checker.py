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