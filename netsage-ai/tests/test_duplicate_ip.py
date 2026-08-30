from engine.rules.checker import check_duplicate_ip


def test_no_duplicate_ip():
    result = check_duplicate_ip(
        {
            "PC-01": "192.168.10.20",
            "PC-02": "192.168.10.21",
            "Server-01": "192.168.30.50",
        }
    )

    assert result["status"] == "PASS"


def test_duplicate_ip_detected():
    result = check_duplicate_ip(
        {
            "PC-01": "192.168.10.20",
            "PC-02": "192.168.10.20",
        }
    )

    assert result["status"] == "FAIL"
    assert result["rule_id"] == "DUPLICATE_IP"


def test_multiple_duplicate_ips():
    result = check_duplicate_ip(
        {
            "PC-01": "192.168.10.20",
            "PC-02": "192.168.10.20",
            "PC-03": "192.168.10.30",
            "PC-04": "192.168.10.30",
        }
    )

    assert result["status"] == "FAIL"
    assert len(result["evidence"]["duplicates"]) == 2


def test_missing_device_data():
    result = check_duplicate_ip({})

    assert result["status"] == "UNKNOWN"


def test_invalid_ip():
    result = check_duplicate_ip(
        {
            "PC-01": "not-an-ip",
        }
    )

    assert result["status"] == "UNKNOWN"