from engine.rules.checker import check_missing_route


def test_destination_route_exists():
    result = check_missing_route(
        "192.168.30.0/24",
        [
            "192.168.10.0/24",
            "192.168.30.0/24",
        ],
    )

    assert result["status"] == "PASS"


def test_destination_route_missing():
    result = check_missing_route(
        "192.168.30.0/24",
        [
            "192.168.10.0/24",
        ],
    )

    assert result["status"] == "FAIL"
    assert result["rule_id"] == "MISSING_ROUTE"


def test_missing_destination_network():
    result = check_missing_route(
        "",
        [
            "192.168.10.0/24",
        ],
    )

    assert result["status"] == "UNKNOWN"


def test_missing_route_table():
    result = check_missing_route(
        "192.168.30.0/24",
        [],
    )

    assert result["status"] == "UNKNOWN"


def test_invalid_destination_network():
    result = check_missing_route(
        "not-a-network",
        [
            "192.168.10.0/24",
        ],
    )

    assert result["status"] == "UNKNOWN"


def test_invalid_route_information():
    result = check_missing_route(
        "192.168.30.0/24",
        [
            "not-a-route",
        ],
    )

    assert result["status"] == "UNKNOWN"