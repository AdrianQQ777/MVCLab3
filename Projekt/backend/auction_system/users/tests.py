from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class UserCreateViewTest(APITestCase):
    def test_create_user(self):

        data = {
            "name": "testuser",
            "email": "test@example.com",
            "password": "testpassword",
        }

        response = self.client.post("/api/users/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_without_name(self):

        data = {"name": "", "email": "test@example.com"}

        response = self.client.post("/api/users/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_with_wrong_email(self):

        data = {"name": "testuser", "email": "not-an-email"}

        response = self.client.post("/api/users/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserViewDetailTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            name="testuser", email="test@example.com", password="testpassword"
        )

    def test_find_user(self):
        response = self.client.get(f"/api/users/{self.user.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data["email"], "test@example.com")

    def test_find_user_wrong_id_format(self):
        response = self.client.get("/api/users/abc/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_user(self):
        data = {
            "name": "updatedname",
            "email": "updated@example.com",
            "password": "updatedpassword",
        }

        response = self.client.put(f"/api/users/{self.user.id}/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()

        self.assertEqual(self.user.name, "updatedname")
        self.assertEqual(self.user.email, "updated@example.com")
        self.assertEqual(self.user.password, "updatedpassword")

    def test_delete_user(self):
        response = self.client.delete(f"/api/users/{self.user.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(User.objects.filter(id=self.user.id).exists())
