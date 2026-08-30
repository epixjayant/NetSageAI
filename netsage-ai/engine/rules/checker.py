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

def check_interface_down(
    interface: str,
    status: str,
    protocol: str,
) -> dict:
    """
    Determine whether a network interface is down
    based on its interface status and line protocol.
    """

    base_result = {
        "rule_id": "INTERFACE_DOWN",
        "severity": "high",
    }

    if not interface or not status or not protocol:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Insufficient information to evaluate interface state.",
            "evidence": {
                "interface": interface,
                "status": status,
                "protocol": protocol,
            },
        }

    status_normalized = status.strip().lower()
    protocol_normalized = protocol.strip().lower()

    if (
        status_normalized in {"administratively down", "down"}
        or protocol_normalized == "down"
    ):
        return {
            **base_result,
            "status": "FAIL",
            "message": "Interface is not operational.",
            "evidence": {
                "interface": interface,
                "status": status,
                "protocol": protocol,
            },
        }

    if status_normalized == "up" and protocol_normalized == "up":
        return {
            **base_result,
            "status": "PASS",
            "severity": "none",
            "message": "Interface is operational.",
            "evidence": {
                "interface": interface,
                "status": status,
                "protocol": protocol,
            },
        }

    return {
        **base_result,
        "status": "UNKNOWN",
        "message": "Interface state could not be determined.",
        "evidence": {
            "interface": interface,
            "status": status,
            "protocol": protocol,
        },
    }

def check_missing_vlan(
    required_vlan: int | str,
    available_vlans: list[int | str],
) -> dict:
    """
    Determine whether a required VLAN is missing from
    the supplied VLAN information.
    """

    base_result = {
        "rule_id": "MISSING_VLAN",
        "severity": "high",
    }

    if required_vlan is None or not available_vlans:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Insufficient information to evaluate VLAN presence.",
            "evidence": {
                "required_vlan": required_vlan,
                "available_vlans": available_vlans,
            },
        }

    try:
        required_vlan_id = int(required_vlan)
        available_vlan_ids = {int(vlan) for vlan in available_vlans}
    except (TypeError, ValueError):
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Invalid VLAN information.",
            "evidence": {
                "required_vlan": required_vlan,
                "available_vlans": available_vlans,
            },
        }

    if required_vlan_id not in available_vlan_ids:
        return {
            **base_result,
            "status": "FAIL",
            "message": "Required VLAN is missing.",
            "evidence": {
                "required_vlan": required_vlan_id,
                "available_vlans": sorted(available_vlan_ids),
            },
        }

    return {
        **base_result,
        "status": "PASS",
        "severity": "none",
        "message": "Required VLAN is present.",
        "evidence": {
            "required_vlan": required_vlan_id,
            "available_vlans": sorted(available_vlan_ids),
        },
    }

def check_missing_route(
    destination_network: str,
    available_routes: list[str],
) -> dict:
    """
    Determine whether a required destination network
    is present in the supplied routing information.
    """

    base_result = {
        "rule_id": "MISSING_ROUTE",
        "severity": "high",
    }

    if not destination_network or not available_routes:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Insufficient information to evaluate route presence.",
            "evidence": {
                "destination_network": destination_network,
                "available_routes": available_routes,
            },
        }

    try:
        destination = ipaddress.ip_network(
            destination_network,
            strict=False,
        )
    except ValueError:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Invalid destination network.",
            "evidence": {
                "destination_network": destination_network,
                "available_routes": available_routes,
            },
        }

    normalized_routes = []

    try:
        for route in available_routes:
            normalized_routes.append(
                ipaddress.ip_network(route, strict=False)
            )
    except ValueError:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Invalid route information.",
            "evidence": {
                "destination_network": destination_network,
                "available_routes": available_routes,
            },
        }

    if destination in normalized_routes:
        return {
            **base_result,
            "status": "PASS",
            "severity": "none",
            "message": "A route to the destination network is present.",
            "evidence": {
                "destination_network": str(destination),
                "available_routes": [
                    str(route) for route in normalized_routes
                ],
            },
        }

    return {
        **base_result,
        "status": "FAIL",
        "message": "No matching route to the destination network was found.",
        "evidence": {
            "destination_network": str(destination),
            "available_routes": [
                str(route) for route in normalized_routes
            ],
        },
    }

def check_duplicate_ip(
    devices: dict[str, str],
) -> dict:
    """
    Determine whether multiple devices are configured
    with the same IP address.
    """

    base_result = {
        "rule_id": "DUPLICATE_IP",
        "severity": "high",
    }

    if not devices:
        return {
            **base_result,
            "status": "UNKNOWN",
            "message": "Insufficient information to evaluate duplicate IP addresses.",
            "evidence": {
                "devices": devices,
            },
        }

    ip_to_devices: dict[str, list[str]] = {}

    for device, ip_address in devices.items():
        if not device or not ip_address:
            return {
                **base_result,
                "status": "UNKNOWN",
                "message": "Invalid device or IP information.",
                "evidence": {
                    "devices": devices,
                },
            }

        try:
            normalized_ip = str(ipaddress.ip_address(ip_address))
        except ValueError:
            return {
                **base_result,
                "status": "UNKNOWN",
                "message": "Invalid IP address information.",
                "evidence": {
                    "devices": devices,
                },
            }

        ip_to_devices.setdefault(normalized_ip, []).append(device)

    duplicates = {
        ip: device_list
        for ip, device_list in ip_to_devices.items()
        if len(device_list) > 1
    }

    if duplicates:
        return {
            **base_result,
            "status": "FAIL",
            "message": "Duplicate IP address detected.",
            "evidence": {
                "duplicates": duplicates,
                "devices": devices,
            },
        }

    return {
        **base_result,
        "status": "PASS",
        "severity": "none",
        "message": "No duplicate IP addresses detected.",
        "evidence": {
            "devices": devices,
        },
    }