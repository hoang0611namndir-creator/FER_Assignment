import { useState } from "react";
import { Badge, Button, ListGroup, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

// Chuông thông báo: bấm vào sẽ mở Modal danh sách thông báo
export default function NotificationBell() {
  const { notifications, markAllRead, refreshNotifications } = useAuth();
  const [show, setShow] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const open = () => {
    refreshNotifications();
    setShow(true);
  };

  return (
    <>
      <Button variant="link" className="text-light position-relative p-1" onClick={open}>
        <i className="bi bi-bell-fill fs-5" />
        {unread > 0 && (
          <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
            {unread}
          </Badge>
        )}
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-bell me-2" />
            Thông báo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {notifications.length === 0 ? (
            <p className="text-muted text-center my-4">Chưa có thông báo nào.</p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((n) => (
                <ListGroup.Item key={n.id} className={n.read ? "" : "bg-light fw-semibold"}>
                  <div>{n.message}</div>
                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleString("vi-VN")}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" disabled={unread === 0} onClick={markAllRead}>
            Đánh dấu đã đọc
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
