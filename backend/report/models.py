from django.db import models

from user.models import User
from utilities.query_type_list import QUERY_TYPE_LIST
from utilities.report_status_list import REPORT_STATUS_LIST


class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
    queryType = models.CharField(max_length=8, choices=QUERY_TYPE_LIST, verbose_name='Query Type')
    query = models.TextField()
    status = models.CharField(max_length=8, choices=REPORT_STATUS_LIST, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        s = f'{self.user} submitted a {self.queryType} on {self.timestamp}'
        return s
