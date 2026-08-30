from engine.rules.checker import check_missing_vlan


def test_required_vlan_exists():
    result = check_missing_vlan(
        10,
        [10, 20, 30],
    )

    assert result["status"] == "PASS"


def test_required_vlan_missing():
    result = check_missing_vlan(
        20,
        [10, 30],
    )

    assert result["status"] == "FAIL"
    assert result["rule_id"] == "MISSING_VLAN"


def test_missing_required_vlan():
    result = check_missing_vlan(
        None,
        [10, 20, 30],
    )

    assert result["status"] == "UNKNOWN"


def test_invalid_vlan_information():
    result = check_missing_vlan(
        "not-a-vlan",
        [10, 20],
    )

    assert result["status"] == "UNKNOWN"


def test_vlan_strings_are_supported():
    result = check_missing_vlan(
        "20",
        ["10", "20", "30"],
    )

    assert result["status"] == "PASS"